Name:		openresty
Version:	1.19.9
Release:	1
Summary:	OpenResty, scalable web platform by extending NGINX with Lua

Group:		System Environment/Daemons
License:	BSD
URL:		http://www.openresty.org/

Source0:	openresty-%{version}.%{release}.tar.gz

BuildRoot:	%{build_root}

AutoReqProv:    no
BuildRequires:	gcc >= 4.8, openssl-devel, pcre-devel, readline-devel
Requires:	openssl, pcre, readline

%description
 
This package contains the core server for OpenResty. Built for production
uses. 
Macking for RHEL-based build. Tested at 3.10.0-1160.25.1-build
Attention at configure-section - change complier and other complier options

%define         resty_prefix     /usr/local/
%define         resty_user       nobody
%define         resty_group      nobody

%define         dir_name      openresty

%define _unpackaged_files_terminate_build 1

%prep
%setup -q -n openresty-%{version}.%{release}

%build

./configure --prefix=%{resty_prefix}/%{dir_name} \
	--with-cc='/usr/local/bin/afl-gcc' \
	--with-cpp='/usr/local/bin/afl-g++'
#	--with-cc-opt='-g -lasan -fsanitize=address' \
#	--with-ld-opt='-lgcov'
	
make %{?_smp_mflags}

%install
make install DESTDIR=$RPM_BUILD_ROOT

rm -rf $RPM_BUILD_ROOT/usr/local/openresty/lualib/rds/
# deleting a file that is missing from the etalon-package (parser.so)

%files
%resty_prefix/openresty/COPYRIGHT
%resty_prefix/openresty/bin/md2pod.pl
%resty_prefix/openresty/bin/nginx-xml2pod
%resty_prefix/openresty/bin/openresty
%resty_prefix/openresty/bin/opm
%resty_prefix/openresty/bin/resty
%resty_prefix/openresty/bin/restydoc
%resty_prefix/openresty/bin/restydoc-index
%resty_prefix/openresty/luajit/bin/luajit
%resty_prefix/openresty/luajit/bin/luajit-2.1.0-beta3
%resty_prefix/openresty/luajit/include/luajit-2.1/lauxlib.h
%resty_prefix/openresty/luajit/include/luajit-2.1/lua.h
%resty_prefix/openresty/luajit/include/luajit-2.1/lua.hpp
%resty_prefix/openresty/luajit/include/luajit-2.1/luaconf.h
%resty_prefix/openresty/luajit/include/luajit-2.1/luajit.h
%resty_prefix/openresty/luajit/include/luajit-2.1/lualib.h
%resty_prefix/openresty/luajit/lib/libluajit-5.1.a
%resty_prefix/openresty/luajit/lib/libluajit-5.1.so
%resty_prefix/openresty/luajit/lib/libluajit-5.1.so.2
%resty_prefix/openresty/luajit/lib/libluajit-5.1.so.2.1.0
%resty_prefix/openresty/luajit/lib/pkgconfig/luajit.pc
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/bc.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/bcsave.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_arm.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_arm64.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_arm64be.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_mips.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_mips64.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_mips64el.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_mipsel.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_ppc.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_x64.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dis_x86.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/dump.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/p.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/v.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/vmdef.lua
%resty_prefix/openresty/luajit/share/luajit-2.1.0-beta3/jit/zone.lua
%resty_prefix/openresty/luajit/share/man/man1/luajit.1
%resty_prefix/openresty/lualib/cjson.so
%resty_prefix/openresty/lualib/librestysignal.so
%resty_prefix/openresty/lualib/ngx/balancer.lua
%resty_prefix/openresty/lualib/ngx/base64.lua
%resty_prefix/openresty/lualib/ngx/errlog.lua
%resty_prefix/openresty/lualib/ngx/ocsp.lua
%resty_prefix/openresty/lualib/ngx/pipe.lua
%resty_prefix/openresty/lualib/ngx/process.lua
%resty_prefix/openresty/lualib/ngx/re.lua
%resty_prefix/openresty/lualib/ngx/resp.lua
%resty_prefix/openresty/lualib/ngx/semaphore.lua
%resty_prefix/openresty/lualib/ngx/ssl.lua
%resty_prefix/openresty/lualib/ngx/ssl/session.lua
%resty_prefix/openresty/lualib/redis/parser.so
%resty_prefix/openresty/lualib/resty/aes.lua
%resty_prefix/openresty/lualib/resty/core.lua
%resty_prefix/openresty/lualib/resty/core/base.lua
%resty_prefix/openresty/lualib/resty/core/base64.lua
%resty_prefix/openresty/lualib/resty/core/ctx.lua
%resty_prefix/openresty/lualib/resty/core/exit.lua
%resty_prefix/openresty/lualib/resty/core/hash.lua
%resty_prefix/openresty/lualib/resty/core/misc.lua
%resty_prefix/openresty/lualib/resty/core/ndk.lua
%resty_prefix/openresty/lualib/resty/core/phase.lua
%resty_prefix/openresty/lualib/resty/core/regex.lua
%resty_prefix/openresty/lualib/resty/core/request.lua
%resty_prefix/openresty/lualib/resty/core/response.lua
%resty_prefix/openresty/lualib/resty/core/shdict.lua
%resty_prefix/openresty/lualib/resty/core/time.lua
%resty_prefix/openresty/lualib/resty/core/uri.lua
%resty_prefix/openresty/lualib/resty/core/utils.lua
%resty_prefix/openresty/lualib/resty/core/var.lua
%resty_prefix/openresty/lualib/resty/core/worker.lua
%resty_prefix/openresty/lualib/resty/dns/resolver.lua
%resty_prefix/openresty/lualib/resty/limit/conn.lua
%resty_prefix/openresty/lualib/resty/limit/count.lua
%resty_prefix/openresty/lualib/resty/limit/req.lua
%resty_prefix/openresty/lualib/resty/limit/traffic.lua
%resty_prefix/openresty/lualib/resty/lock.lua
%resty_prefix/openresty/lualib/resty/lrucache.lua
%resty_prefix/openresty/lualib/resty/lrucache/pureffi.lua
%resty_prefix/openresty/lualib/resty/md5.lua
%resty_prefix/openresty/lualib/resty/memcached.lua
%resty_prefix/openresty/lualib/resty/mysql.lua
%resty_prefix/openresty/lualib/resty/random.lua
%resty_prefix/openresty/lualib/resty/redis.lua
%resty_prefix/openresty/lualib/resty/sha.lua
%resty_prefix/openresty/lualib/resty/sha1.lua
%resty_prefix/openresty/lualib/resty/sha224.lua
%resty_prefix/openresty/lualib/resty/sha256.lua
%resty_prefix/openresty/lualib/resty/sha384.lua
%resty_prefix/openresty/lualib/resty/sha512.lua
%resty_prefix/openresty/lualib/resty/shell.lua
%resty_prefix/openresty/lualib/resty/signal.lua
%resty_prefix/openresty/lualib/resty/string.lua
%resty_prefix/openresty/lualib/resty/upload.lua
%resty_prefix/openresty/lualib/resty/upstream/healthcheck.lua
%resty_prefix/openresty/lualib/resty/websocket/client.lua
%resty_prefix/openresty/lualib/resty/websocket/protocol.lua
%resty_prefix/openresty/lualib/resty/websocket/server.lua
%resty_prefix/openresty/lualib/tablepool.lua
%resty_prefix/openresty/nginx/conf/fastcgi.conf
%resty_prefix/openresty/nginx/conf/fastcgi.conf.default
%resty_prefix/openresty/nginx/conf/fastcgi_params
%resty_prefix/openresty/nginx/conf/fastcgi_params.default
%resty_prefix/openresty/nginx/conf/koi-utf
%resty_prefix/openresty/nginx/conf/koi-win
%resty_prefix/openresty/nginx/conf/mime.types
%resty_prefix/openresty/nginx/conf/mime.types.default
%resty_prefix/openresty/nginx/conf/nginx.conf
%resty_prefix/openresty/nginx/conf/nginx.conf.default
%resty_prefix/openresty/nginx/conf/scgi_params
%resty_prefix/openresty/nginx/conf/scgi_params.default
%resty_prefix/openresty/nginx/conf/uwsgi_params
%resty_prefix/openresty/nginx/conf/uwsgi_params.default
%resty_prefix/openresty/nginx/conf/win-utf
%resty_prefix/openresty/nginx/html/50x.html
%resty_prefix/openresty/nginx/html/index.html
%resty_prefix/openresty/nginx/sbin/nginx
%resty_prefix/openresty/pod/array-var-nginx-module-0.05/array-var-nginx-module-0.05.pod
%resty_prefix/openresty/pod/drizzle-nginx-module-0.1.11/drizzle-nginx-module-0.1.11.pod
%resty_prefix/openresty/pod/echo-nginx-module-0.62/echo-nginx-module-0.62.pod
%resty_prefix/openresty/pod/encrypted-session-nginx-module-0.08/encrypted-session-nginx-module-0.08.pod
%resty_prefix/openresty/pod/form-input-nginx-module-0.12/form-input-nginx-module-0.12.pod
%resty_prefix/openresty/pod/headers-more-nginx-module-0.33/headers-more-nginx-module-0.33.pod
%resty_prefix/openresty/pod/iconv-nginx-module-0.14/iconv-nginx-module-0.14.pod
%resty_prefix/openresty/pod/lua-5.1.5/lua-5.1.5.pod
%resty_prefix/openresty/pod/lua-cjson-2.1.0.8/lua-cjson-2.1.0.8.pod
%resty_prefix/openresty/pod/lua-redis-parser-0.13/lua-redis-parser-0.13.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/lua-resty-core-0.1.22.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.balancer.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.base64.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.errlog.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.ocsp.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.pipe.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.process.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.re.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.resp.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.semaphore.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.ssl.pod
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.ssl.session.pod
%resty_prefix/openresty/pod/lua-resty-dns-0.22/lua-resty-dns-0.22.pod
%resty_prefix/openresty/pod/lua-resty-limit-traffic-0.07/lua-resty-limit-traffic-0.07.pod
%resty_prefix/openresty/pod/lua-resty-limit-traffic-0.07/resty.limit.conn.pod
%resty_prefix/openresty/pod/lua-resty-limit-traffic-0.07/resty.limit.count.pod
%resty_prefix/openresty/pod/lua-resty-limit-traffic-0.07/resty.limit.req.pod
%resty_prefix/openresty/pod/lua-resty-limit-traffic-0.07/resty.limit.traffic.pod
%resty_prefix/openresty/pod/lua-resty-lock-0.08/lua-resty-lock-0.08.pod
%resty_prefix/openresty/pod/lua-resty-lrucache-0.11/lua-resty-lrucache-0.11.pod
%resty_prefix/openresty/pod/lua-resty-memcached-0.16/lua-resty-memcached-0.16.pod
%resty_prefix/openresty/pod/lua-resty-mysql-0.24/lua-resty-mysql-0.24.pod
%resty_prefix/openresty/pod/lua-resty-redis-0.29/lua-resty-redis-0.29.pod
%resty_prefix/openresty/pod/lua-resty-shell-0.03/lua-resty-shell-0.03.pod
%resty_prefix/openresty/pod/lua-resty-signal-0.03/lua-resty-signal-0.03.pod
%resty_prefix/openresty/pod/lua-resty-string-0.14/lua-resty-string-0.14.pod
%resty_prefix/openresty/pod/lua-resty-upload-0.10/lua-resty-upload-0.10.pod
%resty_prefix/openresty/pod/lua-resty-upstream-healthcheck-0.06/lua-resty-upstream-healthcheck-0.06.pod
%resty_prefix/openresty/pod/lua-resty-websocket-0.08/lua-resty-websocket-0.08.pod
%resty_prefix/openresty/pod/lua-tablepool-0.02/lua-tablepool-0.02.pod
%resty_prefix/openresty/pod/luajit-2.1-20210510/luajit-2.1-20210510.pod
%resty_prefix/openresty/pod/luajit-2.1/changes.pod
%resty_prefix/openresty/pod/luajit-2.1/contact.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_c_api.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_ffi.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_ffi_api.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_ffi_semantics.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_ffi_tutorial.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_jit.pod
%resty_prefix/openresty/pod/luajit-2.1/ext_profiler.pod
%resty_prefix/openresty/pod/luajit-2.1/extensions.pod
%resty_prefix/openresty/pod/luajit-2.1/faq.pod
%resty_prefix/openresty/pod/luajit-2.1/install.pod
%resty_prefix/openresty/pod/luajit-2.1/luajit-2.1.pod
%resty_prefix/openresty/pod/luajit-2.1/running.pod
%resty_prefix/openresty/pod/luajit-2.1/status.pod
%resty_prefix/openresty/pod/memc-nginx-module-0.19/memc-nginx-module-0.19.pod
%resty_prefix/openresty/pod/nginx/accept_failed.pod
%resty_prefix/openresty/pod/nginx/beginners_guide.pod
%resty_prefix/openresty/pod/nginx/chunked_encoding_from_backend.pod
%resty_prefix/openresty/pod/nginx/configure.pod
%resty_prefix/openresty/pod/nginx/configuring_https_servers.pod
%resty_prefix/openresty/pod/nginx/contributing_changes.pod
%resty_prefix/openresty/pod/nginx/control.pod
%resty_prefix/openresty/pod/nginx/converting_rewrite_rules.pod
%resty_prefix/openresty/pod/nginx/daemon_master_process_off.pod
%resty_prefix/openresty/pod/nginx/debugging_log.pod
%resty_prefix/openresty/pod/nginx/development_guide.pod
%resty_prefix/openresty/pod/nginx/events.pod
%resty_prefix/openresty/pod/nginx/example.pod
%resty_prefix/openresty/pod/nginx/faq.pod
%resty_prefix/openresty/pod/nginx/freebsd_tuning.pod
%resty_prefix/openresty/pod/nginx/hash.pod
%resty_prefix/openresty/pod/nginx/howto_build_on_win32.pod
%resty_prefix/openresty/pod/nginx/install.pod
%resty_prefix/openresty/pod/nginx/license_copyright.pod
%resty_prefix/openresty/pod/nginx/load_balancing.pod
%resty_prefix/openresty/pod/nginx/nginx.pod
%resty_prefix/openresty/pod/nginx/nginx_dtrace_pid_provider.pod
%resty_prefix/openresty/pod/nginx/ngx_core_module.pod
%resty_prefix/openresty/pod/nginx/ngx_google_perftools_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_access_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_addition_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_api_module_head.pod
%resty_prefix/openresty/pod/nginx/ngx_http_auth_basic_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_auth_jwt_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_auth_request_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_autoindex_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_browser_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_charset_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_core_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_dav_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_empty_gif_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_f4f_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_fastcgi_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_flv_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_geo_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_geoip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_grpc_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_gunzip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_gzip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_gzip_static_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_headers_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_hls_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_image_filter_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_index_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_js_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_keyval_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_limit_conn_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_limit_req_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_log_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_map_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_memcached_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_mirror_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_mp4_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_perl_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_proxy_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_random_index_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_realip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_referer_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_rewrite_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_scgi_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_secure_link_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_session_log_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_slice_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_spdy_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_split_clients_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_ssi_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_ssl_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_status_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_stub_status_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_sub_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_upstream_conf_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_upstream_hc_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_upstream_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_userid_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_uwsgi_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_v2_module.pod
%resty_prefix/openresty/pod/nginx/ngx_http_xslt_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_auth_http_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_core_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_imap_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_pop3_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_proxy_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_smtp_module.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_ssl_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_access_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_core_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_geo_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_geoip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_js_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_keyval_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_limit_conn_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_log_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_map_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_proxy_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_realip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_return_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_split_clients_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_ssl_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_ssl_preread_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_upstream_hc_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_upstream_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_zone_sync_module.pod
%resty_prefix/openresty/pod/nginx/request_processing.pod
%resty_prefix/openresty/pod/nginx/server_names.pod
%resty_prefix/openresty/pod/nginx/stream_processing.pod
%resty_prefix/openresty/pod/nginx/switches.pod
%resty_prefix/openresty/pod/nginx/syntax.pod
%resty_prefix/openresty/pod/nginx/sys_errlist.pod
%resty_prefix/openresty/pod/nginx/syslog.pod
%resty_prefix/openresty/pod/nginx/variables_in_config.pod
%resty_prefix/openresty/pod/nginx/websocket.pod
%resty_prefix/openresty/pod/nginx/welcome_nginx_facebook.pod
%resty_prefix/openresty/pod/nginx/windows.pod
%resty_prefix/openresty/pod/ngx_devel_kit-0.3.1/ngx_devel_kit-0.3.1.pod
%resty_prefix/openresty/pod/ngx_lua-0.10.20/ngx_lua-0.10.20.pod
%resty_prefix/openresty/pod/ngx_lua_upstream-0.07/ngx_lua_upstream-0.07.pod
%resty_prefix/openresty/pod/ngx_postgres-1.0/ngx_postgres-1.0.pod
%resty_prefix/openresty/pod/ngx_postgres-1.0/todo.pod
%resty_prefix/openresty/pod/ngx_stream_lua-0.0.10/dev_notes.pod
%resty_prefix/openresty/pod/ngx_stream_lua-0.0.10/ngx_stream_lua-0.0.10.pod
%resty_prefix/openresty/pod/opm-0.0.6/opm-0.0.6.pod
%resty_prefix/openresty/pod/rds-csv-nginx-module-0.09/rds-csv-nginx-module-0.09.pod
%resty_prefix/openresty/pod/rds-json-nginx-module-0.15/rds-json-nginx-module-0.15.pod
%resty_prefix/openresty/pod/redis2-nginx-module-0.15/redis2-nginx-module-0.15.pod
%resty_prefix/openresty/pod/resty-cli-0.28/resty-cli-0.28.pod
%resty_prefix/openresty/pod/set-misc-nginx-module-0.32/set-misc-nginx-module-0.32.pod
%resty_prefix/openresty/pod/srcache-nginx-module-0.32/srcache-nginx-module-0.32.pod
%resty_prefix/openresty/pod/xss-nginx-module-0.06/xss-nginx-module-0.06.pod
%resty_prefix/openresty/lualib/ngx/req.lua
%resty_prefix/openresty/lualib/resty/core/socket.lua
%resty_prefix/openresty/pod/lua-resty-core-0.1.22/ngx.req.pod
%resty_prefix/openresty/pod/nginx/ngx_mail_realip_module.pod
%resty_prefix/openresty/pod/nginx/ngx_stream_set_module.pod
%resty_prefix/openresty/pod/ngx_devel_kit-0.3.1/readme_auto_lib.pod
%resty_prefix/openresty/pod/opm-0.0.6/web.docs.md.docs.pod
%resty_prefix/openresty/resty.index

%defattr(-,%{resty_user},%{resty_group},-)

%clean
rm -rf $RPM_BUILD_ROOT

%changelog
* Sun Jul 18 2021 cert
- Exclude %resty_prefix/openresty/lualib/rds/parser.so
+ Compiler changed on AFL

* Mon Mar 28 2022 cert
+Added files
+   /usr/local/openresty/lualib/ngx/req.lua
+   /usr/local/openresty/lualib/resty/core/socket.lua
+   /usr/local/openresty/pod/lua-resty-core-0.1.22/ngx.req.pod
+   /usr/local/openresty/pod/nginx/ngx_mail_realip_module.pod
+   /usr/local/openresty/pod/nginx/ngx_stream_set_module.pod
+   /usr/local/openresty/pod/ngx_devel_kit-0.3.1/readme_auto_lib.pod
+   /usr/local/openresty/pod/opm-0.0.6/web.docs.md.docs.pod
