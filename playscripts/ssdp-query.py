#!/usr/bin/python
import socket  
import sys

dst = "239.255.255.250"  
if len(sys.argv) > 1:  
    dst = sys.argv[1]
st = "upnp:rootdevice"  
if len(sys.argv) > 2:  
    st = sys.argv[2]

msg = [  
    'M-SEARCH * HTTP/1.1',
    'Host:239.255.255.250:1900',
    'ST:%s' % (st,),
    'Man:"ssdp:discover"',
    'MX:1',
    '']

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)  
s.settimeout(10)  
s.sendto('\r\n'.join(msg), (dst, 1900) )

while True:  
    try:
        data, addr = s.recvfrom(32*1024)
    except socket.timeout:
        break
    print "[+] %s\n%s" % (addr, data)
    
     """
     When a control point is added to the network, the UPnP discovery protocol allows that control point to search for devices of interest on the network. It does this by multicasting on the reserved address and port (239.255.255.250:1900) a search message with a pattern, or target, equal to a type or identifier for a device or service. Responses from devices contain discovery messages essentially identical to those advertised by newly connected devices; the former are unicast while the latter are multicast. Control points can also send a unicast search message to a known IP address and port 1900 or the port indicated by SEARCHPORT.UPNP.ORG, to verify the existence of UPnP device(s) and service(s) at the IP address. For example, a unicast search may be used to quickly check whether a known UPnP device or service is still available on the network. Multi-homed control points are allowed to choose to send discovery messages on any, some or all of its UPnP-enabled interfaces.
     """
