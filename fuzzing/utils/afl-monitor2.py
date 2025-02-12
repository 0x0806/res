#! /usr/bin/python
#
# Extended monitoring and reporting tool for AFL
# -------------------------------------------------
#
# Written and maintained by Paul S. Ziegler
#
# Copyright 2017 Reflare Ltd. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at:
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Plotting code taken from afl-plot by

from sys import argv,exit,stdout
from os import listdir,system,path
from commands import getoutput, getstatusoutput
from time import sleep,time
import re, pickle

OPTIONS = {"nocolor": False, "commandline": False, "verbose": False, "html": False, "execute": False, "recursive": False, "directory": False, "findings": False}

# Pretty print function
COLORS = {"HEADER" : '\033[95m',
    "OKBLUE" : '\033[94m',
    "OKGREEN" : '\033[92m',
    "WARNING" : '\033[93m',
    "FAIL" : '\033[91m',
    "BOLD" : '\033[1m',
    "UNDERLINE" : '\033[4m',
    "ENDC" : '\033[0m'
}

def removeColor(s):
    ansi_escape = re.compile(r'\x1b[^m]*m')
    s = ansi_escape.sub('', s)
    return s

def pprint(s):
    if OPTIONS["nocolor"]:
        s = removeColor(s)
    print s

def secondsToTimestamp(seconds):
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    if h > 100000:
        return "/"
    return "%d hours %02d minutes %02d seconds" % (h, m, s)


def printUsage():
    print """This program processes a findings directory generated by afl-fuzz
    and displays the findings in various formats

./afl-monitor [-n | --nocolor] [-c | --commandLine] [-v | --verbose] [-h | --html output_directory]
    [-e | --execute command] [-r | --recursive second_count]  findings_directory

The findings_directory parameter should point to an existing findings directory
containing one or several state directories for any active or stopped instance
of afl-fuzz.

-n | --nocolor\t\tSuppresses color output.

-c | --commandLine\tOutput to the command line (can be used with -h)

-v | --verbose\t\tShow per-fuzzer statistics in commandline mode and Per-Fuzzer
                        graphing in HTML mode.

-h | --html\t\tOutput in HTML format. output_directory must be an empty
                        directory in which the output files will be saved. Will generate 1
                        index.html file and several plot images. Enables graph plotting.

-e | --execute\t\tExecutes the provided command (use quotes if using arguments)
                        and passes the commandline output via stdin (pipe) if a
                        new crash is detected.

-r | --recursive\tRe-runs this script with all provided arguments every
                        'second_count' seconds.
"""

def printBanner():
    pprint(COLORS["BOLD"] + COLORS["OKGREEN"] + "afl-monitor" + " " + COLORS["ENDC"] + "Version 1.0" + COLORS["ENDC"])


# Parse options
for c in range(len(argv)):
    arg = argv[c]
    if arg == "-n" or arg == "--nocolor":
        OPTIONS["nocolor"] = True
    elif arg == "-c" or arg == "--commandLine":
        OPTIONS["commandline"] = True
    elif arg == "-v" or arg == "--verbose":
        OPTIONS["verbose"] = True
    elif arg == "-h" or arg == "--html":
        try:
            OPTIONS["html"] = argv[c+1]
        except:
            printUsage()
            print "\n\nERROR: No output directory specified for --html option!"
            exit()
    elif arg == "-e" or arg == "--execute":
        try:
            OPTIONS["execute"] = argv[c+1]
        except:
            printUsage()
            print "\n\nERROR: No command specified for --execute option!"
            exit()
    elif arg == "-r" or arg == "--recursive":
        try:
            OPTIONS["recursive"] = int(argv[c+1])
        except:
            printUsage()
            print "\n\nERROR: No time specified for --recursive option!"
            exit()
OPTIONS["findings"] = argv[-1]

# Logic checks
if OPTIONS["execute"] == False and OPTIONS["commandline"] == False and OPTIONS["html"] == False:
    printUsage()
    print "\n\nERROR: Need to specify at least one output method (-c | -h | -e)!"
    exit()

if OPTIONS["html"]:
    try:
        listdir(OPTIONS["html"])
    except:
        printUsage()
        print "\n\nERROR: Cannot access HTML output folder!"
        exit()

if OPTIONS["recursive"] != False and OPTIONS["recursive"] < 1:
    printUsage()
    print "\n\nERROR: The second_count argument used with the --recursive option must be at least 1!"
    exit()

try:
    listdir(OPTIONS["findings"])
except:
    printUsage()
    print "\n\nERROR: Cannot access findings_directory!"
    exit()

printBanner()

# Check for GNUPlot
hasGnuplot = False
if getstatusoutput("gnuplot -V")[0] == 0:
    hasGnuplot = True

bresenhamLine = lambda m, n: [i*n//m + n//(2*m) for i in range(m)]

def trimPlotFile(path):
    full = open(path).read().split("\n")[1:]
    indices = bresenhamLine(1000, len(full))
    if len(full) <= 1000:
        system("cp %s %s.trim" % (path,path))
        return

    output = ""
    for i in indices:
        output += "%s\n" % full[i]
    trim = open("%s.trim" % path,"w")
    trim.write(output)
    trim.close()


if OPTIONS["html"] and not hasGnuplot:
    pprint("%s%s[WARNING]%s gnuplot not found in PATH. Skipping graph generation." % (COLORS["FAIL"], COLORS["BOLD"], COLORS["ENDC"]))

# Recursive Loop
if OPTIONS["recursive"]:
    argv_string = ""
    c = 0
    while c < len(argv):
        arg = argv[c]
        if arg == "-r" or arg == "--recursive":
            c += 2
            continue
        argv_string += " %s" % arg
        c += 1
    while True:
        print " "
        system("date")
        print "============="
        system(argv_string)
        sleep(OPTIONS["recursive"])

directories = listdir(OPTIONS["findings"])
directories.sort()
fuzzers = {}
for directory in directories:
    try:
        raw = open("%s/%s/fuzzer_stats" % (OPTIONS["findings"], directory)).read().split("\n")
        data = {}
        for line in raw:
            if line == "":
                continue
            parts = line.split(":")
            data[parts[0].strip()] = parts[1].strip()
        fuzzers[directory] = data
    except:
        pass

DATA = {}
DATA["totalFuzzers"] = len(fuzzers)
DATA["aliveFuzzers"] = 0
DATA["totalExecs"] = 0
DATA["totalSpeed"] = 0
DATA["pendingGeneral"] = 0
DATA["pendingFavorite"] = 0
DATA["pathsTotal"] = 0
DATA["pathsFavorite"] = 0
DATA["totalStability"] = 0
DATA["leastStable"] = 100
DATA["mostStable"] = 0
DATA["lastPath"] = 0
DATA["lastCrash"] = 0
DATA["lastHang"] = 0
DATA["crashes"] = 0
DATA["hangs"] = 0
DATA["totalCycles"] = 0
DATA["maxCycle"] = 0
PREVIOUS = DATA
PER_CORE_HTML = {}
now = time()
for k,v in fuzzers.iteritems():
    isAlive = False
    if path.isdir("/proc/%s" % v["fuzzer_pid"]):
        isAlive = True
    if isAlive:
        DATA["aliveFuzzers"] += 1
        DATA["totalSpeed"] += float(v["execs_per_sec"])
    DATA["pendingGeneral"] += int(v["pending_total"])
    DATA["pendingFavorite"] += int(v["pending_favs"])
#    DATA["pathsTotal"] += int(v["paths_total"])
    DATA["pathsTotal"] += int(v["corpus_count"])
#    DATA["pathsFavorite"] += int(v["corpus_favored"])
    DATA["pathsFavorite"] += int(v["corpus_favored"])
    DATA["totalExecs"] += int(v["execs_done"])
    stability = float(v["stability"].replace("%",""))
    DATA["totalStability"] += stability
    if stability < DATA["leastStable"]:
        DATA["leastStable"] = stability
    if stability > DATA["mostStable"]:
        DATA["mostStable"] = stability
#    if int(v["last_path"]) > DATA["lastPath"]:
    if int(v["last_find"]) > DATA["lastPath"]:
        DATA["lastPath"] = int(v["last_find"])
    if int(v["last_crash"]) > DATA["lastCrash"]:
        DATA["lastCrash"] = int(v["last_crash"])
    if int(v["last_hang"]) > DATA["lastHang"]:
        DATA["lastHang"] = int(v["last_hang"])
#    DATA["crashes"] += int(v["unique_crashes"])
    DATA["crashes"] += int(v["saved_crashes"])
    DATA["hangs"] += int(v["saved_hangs"])
#    DATA["hangs"] += int(v["unique_hangs"])
    DATA["totalCycles"] += int(v["cycles_done"])
    if int(v["cycles_done"]) > DATA["maxCycle"]:
        DATA["maxCycle"] = int(v["cycles_done"])

    if OPTIONS["commandline"] and OPTIONS["verbose"]:
        pprint("")
        pprint("%s%s[ %s%s%s %s]%s" % (COLORS["BOLD"], COLORS["OKBLUE"], COLORS["ENDC"], COLORS["BOLD"], v["afl_banner"], COLORS["OKBLUE"], COLORS["ENDC"]))
        if isAlive:
            pprint("Status:%s\t\t\t%sALIVE%s" % (COLORS["BOLD"], COLORS["OKGREEN"], COLORS["ENDC"]))
        else:
            pprint("Status:%s\t\t\t%sDEAD%s" % (COLORS["BOLD"], COLORS["FAIL"], COLORS["ENDC"]))
        pprint("Executions:\t\t%s%s%s" % (COLORS["BOLD"],'{:,}'.format(int(v["execs_done"])),COLORS["ENDC"]))
        if isAlive:
            pprint("Current Speed:\t\t%s%s%s execs/second" % (COLORS["BOLD"],'{:,.2f}'.format(float(v["execs_per_sec"])),COLORS["ENDC"]))
        pprint("Paths Found (Favs/All):\t%s%s%s / %s%s%s" % (COLORS["BOLD"],'{:,}'.format(int(v["corpus_favored"])),COLORS["ENDC"],COLORS["BOLD"],'{:,}'.format(int(v["corpus_count"])),COLORS["ENDC"]))
        #pprint("Paths Found (Favs/All):\t%s%s%s / %s%s%s" % (COLORS["BOLD"],'{:,}'.format(int(v["paths_favored"])),COLORS["ENDC"],COLORS["BOLD"],'{:,}'.format(int(v["paths_total"])),COLORS["ENDC"]))
        pprint("Pending (Favs/All):\t%s%s%s / %s%s%s" % (COLORS["BOLD"],'{:,}'.format(int(v["pending_favs"])),COLORS["ENDC"],COLORS["BOLD"],'{:,}'.format(int(v["pending_total"])),COLORS["ENDC"]))
        pprint("Stability:\t\t%s%s%s" % (COLORS["BOLD"], v["stability"], COLORS["ENDC"]))
        pprint("Cycle:\t\t\t%s%d%s" % (COLORS["BOLD"], int(v["cycles_done"]),COLORS["ENDC"]))
        pprint("Last Path:\t\t%s%s%s ago" % (COLORS["BOLD"], secondsToTimestamp(now - float(v["last_find"])), COLORS["ENDC"]))
#        pprint("Last Path:\t\t%s%s%s ago" % (COLORS["BOLD"], secondsToTimestamp(now - float(v["last_path"])), COLORS["ENDC"]))
        pprint("Last Hang:\t\t%s%s%s ago" % (COLORS["BOLD"], secondsToTimestamp(now - float(v["last_hang"])), COLORS["ENDC"]))
        pprint("Last Crash:\t\t%s%s%s ago" % (COLORS["BOLD"], secondsToTimestamp(now - float(v["last_crash"])), COLORS["ENDC"]))
        pprint("Unique Crashes:\t\t%s%s%d%s" % (COLORS["BOLD"],COLORS["FAIL"],int(v["saved_crashes"]),COLORS["ENDC"]))
        #pprint("Unique Crashes:\t\t%s%s%d%s" % (COLORS["BOLD"],COLORS["FAIL"],int(v["unique_crashes"]),COLORS["ENDC"]))

    if OPTIONS["html"]:
        html_out = "<table>"
        if isAlive:
            html_out += "<tr><td>Status:</td><td><b><span style=\"color: #98DF00\">ALIVE</span></b></td></tr>"
        else:
            html_out += "<tr><td>Status:</td><td><b><span style=\"color: #FA023C\">DEAD</span></b></td></tr>"
        html_out += "<tr><td>Executions:</td><td><b>%s</b></td></tr>" % ('{:,}'.format(int(v["execs_done"])))
        if isAlive:
            html_out += "<tr><td>Current Speed:</td><td><b>%s</b> execs/second</td></tr>" % ('{:,.2f}'.format(float(v["execs_per_sec"])))
        html_out += "<tr><td>Paths Found (Favs/All):</td><td><b>%s</b> / <b>%s</b></td></tr>" % ('{:,}'.format(int(v["corpus_favored"])),'{:,}'.format(int(v["corpus_count"])))
        #html_out += "<tr><td>Paths Found (Favs/All):</td><td><b>%s</b> / <b>%s</b></td></tr>" % ('{:,}'.format(int(v["paths_favored"])),'{:,}'.format(int(v["paths_total"])))
        html_out += "<tr><td>Pending (Favs/All):</td><td><b>%s</b> / <b>%s</b></td></tr>" % ('{:,}'.format(int(v["pending_favs"])),'{:,}'.format(int(v["pending_total"])))
        html_out += "<tr><td>Stability:</td><td><b>%s</b></td></tr>" % (v["stability"])
        html_out += "<tr><td>Cycle:</td><td><b>%d</b></td></tr>" % (int(v["cycles_done"]))
        html_out += "<tr><td>Last Path:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - float(v["last_find"])))
        #html_out += "<tr><td>Last Path:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - float(v["last_path"])))
        html_out += "<tr><td>Last Hang:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - float(v["last_hang"])))
        html_out += "<tr><td>Last Crash:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - float(v["last_crash"])))
        html_out += "<tr><td>Unique Crashes:</td><td><b>%d</b></td></tr>" % (int(v["saved_crashes"]))
        #html_out += "<tr><td>Unique Crashes:</td><td><b>%d</b></td></tr>" % (int(v["unique_crashes"]))
        html_out += "</table>"

        if hasGnuplot and OPTIONS["verbose"]:
            # Trim file
            trimPlotFile("%s/%s/plot_data" % (OPTIONS["findings"], k))

            # Generate Graphs
            system("""echo "
            set terminal png truecolor enhanced size 1000,300 butt
            set output '%s/%s_high_freq.png'
            set xdata time
            set timefmt '%%s'
            set tics font 'small'
            unset mxtics
            unset mytics
            set grid xtics linetype 0 linecolor rgb '#e0e0e0'
            set grid ytics linetype 0 linecolor rgb '#e0e0e0'
            set border linecolor rgb '#50c0f0'
            set tics textcolor rgb '#000000'
            set key outside
            set autoscale xfixmin
            set autoscale xfixmax
            plot '%s/%s/plot_data.trim' using 1:4 with filledcurve x1 title 'total paths' linecolor rgb '#000000' fillstyle transparent solid 0.2 noborder, '' using 1:3 with filledcurve x1 title 'current path' linecolor rgb '#f0f0f0' fillstyle transparent solid 0.5 noborder, '' using 1:5 with lines title 'pending paths' linecolor rgb '#0090ff' linewidth 3, '' using 1:6 with lines title 'pending favs' linecolor rgb '#c00080' linewidth 3, '' using 1:2 with lines title 'cycles done' linecolor rgb '#c000f0' linewidth 3
            set terminal png truecolor enhanced size 1000,200 butt
            set output '%s/%s_low_freq.png'
            plot '%s/%s/plot_data.trim' using 1:8 with filledcurve x1 title '' linecolor rgb '#c00080' fillstyle transparent solid 0.2 noborder, '' using 1:8 with lines title ' uniq crashes' linecolor rgb '#c00080' linewidth 3, '' using 1:9 with lines title 'uniq hangs' linecolor rgb '#c000f0' linewidth 3, '' using 1:10 with lines title 'levels' linecolor rgb '#0090ff' linewidth 3
            set terminal png truecolor enhanced size 1000,200 butt
            set output '%s/%s_exec_speed.png'
            plot '%s/%s/plot_data.trim' using 1:11 with filledcurve x1 title '' linecolor rgb '#0090ff' fillstyle transparent solid 0.2 noborder, '%s/%s/plot_data.trim' using 1:11 with lines title '    execs/sec' linecolor rgb '#0090ff' linewidth 3 smooth bezier;
            " | gnuplot""" % (OPTIONS["html"], k, OPTIONS["findings"], k, OPTIONS["html"], k, OPTIONS["findings"], k, OPTIONS["html"], k, OPTIONS["findings"], k, OPTIONS["findings"], k))
            html_out += "<div><img src=\"%s_high_freq.png\"></div>" % (k)
            html_out += "<div><img src=\"%s_low_freq.png\"></div>" % (k)
            html_out += "<div><img src=\"%s_exec_speed.png\"></div>" % (k)

        PER_CORE_HTML[k] = html_out
try:
    PREVIOUS = pickle.load(open(".afl-monitor.state"))
except:
    pass

def makeDeltaString(value,mode="ansi"):
    if mode == "ansi":
        if value > 0.01:
            return "%s (+%s)%s" % (COLORS["OKGREEN"], '{:,.2f}'.format(value), COLORS["ENDC"])
        if value < -0.01:
            return "%s (%s)%s" % (COLORS["FAIL"], '{:,.2f}'.format(value), COLORS["ENDC"])
    else:
        if value > 0.01:
            return "<span style=\"color: #98DF00\"> (+%s)</span>" % ('{:,.2f}'.format(value))
        if value < -0.01:
            return "<span style=\"color: #FA023C\"> (%s)</span>" % ('{:,.2f}'.format(value))
    return ""

deltaAliveFuzzers = DATA["aliveFuzzers"] - PREVIOUS["aliveFuzzers"]
deltaTotalFuzzers = DATA["totalFuzzers"] - PREVIOUS["totalFuzzers"]
deltaTotalExecs = DATA["totalExecs"] - PREVIOUS["totalExecs"]
deltaTotalSpeed = DATA["totalSpeed"] - PREVIOUS["totalSpeed"]
deltaPathsFavorite = DATA["pathsFavorite"] - PREVIOUS["pathsFavorite"]
deltaPathsTotal = DATA["pathsTotal"] - PREVIOUS["pathsTotal"]
deltaPendingFavorite = DATA["pendingFavorite"] - PREVIOUS["pendingFavorite"]
deltaPendingGeneral = DATA["pendingGeneral"] - PREVIOUS["pendingGeneral"]
try:
    deltaAverageStability = (DATA["totalStability"] / DATA["totalFuzzers"]) - (PREVIOUS["totalStability"] / PREVIOUS["totalFuzzers"])
except:
    deltaAverageStability = 0
deltaMaxCycle = DATA["maxCycle"] - PREVIOUS["maxCycle"]
deltaMostStable = DATA["mostStable"] - PREVIOUS["mostStable"]
deltaLeastStable = DATA["leastStable"] - PREVIOUS["leastStable"]
deltaUniqueCrashes = DATA["crashes"] - PREVIOUS["crashes"]

output = "\n"
output += "%s%s[%s%s SUMMARY %s]%s\n" % (COLORS["BOLD"], COLORS["OKBLUE"], COLORS["ENDC"], COLORS["BOLD"], COLORS["OKBLUE"], COLORS["ENDC"])
output += "Fuzzers (Alive/Total):\t%s%d%s%s / %s%d%s%s\n" % (COLORS["BOLD"], DATA["aliveFuzzers"], makeDeltaString(deltaAliveFuzzers), COLORS["ENDC"],COLORS["BOLD"], DATA["totalFuzzers"], makeDeltaString(deltaTotalFuzzers), COLORS["ENDC"])
output += "Total Executions:\t%s%s%s%s\n" % (COLORS["BOLD"],'{:,}'.format(DATA["totalExecs"]),COLORS["ENDC"], makeDeltaString(deltaTotalExecs))
try:
    output += "Current Speed:\t\t%s%s%s%s execs/second\n" % (COLORS["BOLD"],'{:,.2f}'.format(DATA["totalSpeed"]),COLORS["ENDC"], makeDeltaString(deltaTotalSpeed))
    output += "Average Speed per Core:\t%s%s%s%s execs/second\n" % (COLORS["BOLD"],'{:,.2f}'.format(DATA["totalSpeed"] / DATA["aliveFuzzers"]),COLORS["ENDC"], makeDeltaString(deltaTotalSpeed / DATA["aliveFuzzers"]))
except:
    output += "Current Speed:\t\t%s%s%s execs/second\n" % (COLORS["BOLD"],"0.00",COLORS["ENDC"])
output += "Paths Found (Favs/All):\t%s%s%s%s / %s%s%s%s\n" % (COLORS["BOLD"],'{:,}'.format(DATA["pathsFavorite"]),COLORS["ENDC"], makeDeltaString(deltaPathsFavorite),COLORS["BOLD"],'{:,}'.format(DATA["pathsTotal"]),COLORS["ENDC"], makeDeltaString(deltaPathsTotal))
output += "Pending (Favs/All):\t%s%s%s%s / %s%s%s%s\n" % (COLORS["BOLD"],'{:,}'.format(DATA["pendingFavorite"]),COLORS["ENDC"], makeDeltaString(deltaPendingFavorite),COLORS["BOLD"],'{:,}'.format(DATA["pendingGeneral"]),COLORS["ENDC"], makeDeltaString(deltaPendingGeneral))
try:
    output += "Average Stability:\t%s%.2f%%%s%s\n" % (COLORS["BOLD"], DATA["totalStability"] / DATA["totalFuzzers"], COLORS["ENDC"], makeDeltaString(deltaAverageStability))
except:
    pass
output += "Most Stable Fuzzer:\t%s%.2f%%%s%s\n" % (COLORS["BOLD"], DATA["mostStable"], COLORS["ENDC"], makeDeltaString(deltaMostStable))
output += "Least Stable Fuzzer:\t%s%.2f%%%s%s\n" % (COLORS["BOLD"], DATA["leastStable"], COLORS["ENDC"], makeDeltaString(deltaLeastStable))
try:
    output +="Average Cycle Complete:\t%s%s%s\n" % (COLORS["BOLD"], int(float(DATA["totalCycles"]) / DATA["totalFuzzers"]),COLORS["ENDC"])
except:
    pass
output += "Maximum Cycle Complete:\t%s%s%s%s\n" % (COLORS["BOLD"], DATA["maxCycle"],COLORS["ENDC"], makeDeltaString(deltaMaxCycle))
output += "Last Path:\t\t%s%s%s ago\n" % (COLORS["BOLD"], secondsToTimestamp(now - DATA["lastPath"]), COLORS["ENDC"])
output += "Last Hang:\t\t%s%s%s ago\n" % (COLORS["BOLD"], secondsToTimestamp(now - DATA["lastHang"]), COLORS["ENDC"])
output += "Last Crash:\t\t%s%s%s ago\n" % (COLORS["BOLD"], secondsToTimestamp(now - DATA["lastCrash"]), COLORS["ENDC"])
output += "Unique Crashes:\t\t%s%s%d%s%s\n" % (COLORS["BOLD"],COLORS["HEADER"],DATA["crashes"],COLORS["ENDC"], makeDeltaString(deltaUniqueCrashes))


if OPTIONS["commandline"]:
    pprint(output)

if OPTIONS["execute"] and deltaUniqueCrashes > 0:
    pprint("%s%s[%s%s Got new crash! Sending to CMD... %s]%s\n" % (COLORS["BOLD"], COLORS["OKBLUE"], COLORS["ENDC"], COLORS["BOLD"], COLORS["OKBLUE"], COLORS["ENDC"]))
    plain_output = removeColor(output)
    system("echo '%s' | %s" % (plain_output,OPTIONS["execute"]))

if OPTIONS["html"]:
    html_file = open(OPTIONS["html"] + "/index.html","w")
    html_out = ""
    html_out += """<html><head><style>
    body { background-color: #fff; color: #333;	font: 14px/20px "HelveticaNeue-Light", "HelveticaNeue", Helvetica, Arial, sans-serif; }
  </style><meta charset="UTF-8"></head><body>"""
    html_out += "<h1>AFL Fuzzer Status</h1>"
    html_out += "<h3>Generated by afl-monitor 1.0</h3>"
    html_out += "<h2 style=\"margin-top:50px\">Summary</h2>"
    html_out += "<table style=\"border: 1 solid #000;\">"
    html_out += "<tr><td>Time:</td><td><b>%s</b></td></tr>" % getoutput("date")
    html_out += "<tr><td>Fuzzers (Alive/Total):</td><td><b>%d</b>%s / <b>%d</b>%s</b></td></tr>" % (DATA["aliveFuzzers"], makeDeltaString(deltaAliveFuzzers,"html"), DATA["totalFuzzers"], makeDeltaString(deltaTotalFuzzers,"html")) + "</td></tr>"
    html_out += "<tr><td>Total Executions:</td><td><b>%s</b>%s</td></tr>" % ('{:,}'.format(DATA["totalExecs"]), makeDeltaString(deltaTotalExecs,"html"))
    try:
        html_out += "<tr><td>Current Speed:</td><td><b>%s</b>%s execs/second</td></tr>" % ('{:,.2f}'.format(DATA["totalSpeed"]), makeDeltaString(deltaTotalSpeed,"html"))
        html_out += "<tr><td>Average Speed per Core:</td><td><b>%s</b>%s execs/second</td></tr>" % ('{:,.2f}'.format(DATA["totalSpeed"] / DATA["aliveFuzzers"],"html"), makeDeltaString(deltaTotalSpeed / DATA["aliveFuzzers"],"html"))
    except:
        pass
    html_out += "<tr><td>Paths Found (Favs/All):</td><td><b>%s</b>%s / <b>%s</b>%s\n</td></tr>" % ('{:,}'.format(DATA["pathsFavorite"]), makeDeltaString(deltaPathsFavorite,"html"),'{:,}'.format(DATA["pathsTotal"]), makeDeltaString(deltaPathsTotal,"html"))
    html_out += "<tr><td>Pending (Favs/All):</td><td><b>%s</b>%s / <b>%s</b>%s</td></tr>" % ('{:,}'.format(DATA["pendingFavorite"]), makeDeltaString(deltaPendingFavorite,"html"),'{:,}'.format(DATA["pendingGeneral"]), makeDeltaString(deltaPendingGeneral,"html"))
    try:
        html_out += "<tr><td>Average Stability:</td><td><b>%.2f%%</b>%s</td></tr>" % (DATA["totalStability"] / DATA["totalFuzzers"],  makeDeltaString(deltaAverageStability,"html"))
    except:
        pass
    html_out += "<tr><td>Most Stable Fuzzer:</td><td><b>%.2f%%</b>%s</td></tr>" % (DATA["mostStable"], makeDeltaString(deltaMostStable,"html"))
    html_out += "<tr><td>Least Stable Fuzzer:</td><td><b>%.2f%%</b>%s</td></tr>" % (DATA["leastStable"], makeDeltaString(deltaLeastStable,"html"))
    try:
        html_out +="<tr><td>Average Cycle Complete</td><td><b>%s</b></td></tr>" % (int(float(DATA["totalCycles"]) / DATA["totalFuzzers"]))
    except:
        pass
    html_out += "<tr><td>Maximum Cycle Complete</td><td><b>%s</b>%s</td></tr>" % ( DATA["maxCycle"], makeDeltaString(deltaMaxCycle, "html"))
    html_out += "<tr><td>Last Path:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - DATA["lastPath"]))
    html_out += "<tr><td>Last Hang:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - DATA["lastHang"]))
    html_out += "<tr><td>Last Crash:</td><td><b>%s</b> ago</td></tr>" % (secondsToTimestamp(now - DATA["lastCrash"]))
    html_out += "<tr><td>Unique Crashes:</td><td><b>%d</b>%s</td></tr>" % (DATA["crashes"], makeDeltaString(deltaUniqueCrashes,"html"))
    html_out += "</table>"
    html_out += "<h2 style=\"margin-top:50px\">Per-Fuzzer Statistics</h2>"
    for fuzzer in fuzzers:
        html_out += "<h3>%s</h3>" % fuzzer
        html_out += PER_CORE_HTML[fuzzer]
    html_out += "</body></html>"
    html_file.write(html_out)
    html_file.close()

pickle.dump(DATA,open(".afl-monitor.state","w"))
