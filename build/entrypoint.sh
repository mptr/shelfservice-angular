#!/bin/sh
set -ex

echo resolver "$(awk 'BEGIN{ORS=" "} $1=="nameserver" {print $2}' /etc/resolv.conf)" ";" > /etc/nginx/resolvers.conf

NGINX_CONF_TEMPLATE=/etc/nginx/nginx.template.conf
if [ -e $NGINX_CONF_TEMPLATE ]
	then
		echo "found nginx configuration template. will use the template contents."
		mv -v "${NGINX_CONF_TEMPLATE}" /etc/nginx/nginx.conf
		echo "** Generated nginx.conf ***********************************************"
		cat /etc/nginx/nginx.conf
		echo "***********************************************************************"
		echo
		echo "If one of the environment variables is not set or the server name can not be resolved the startup will fail!"
    if [ -z "$GATE_BASE_HREF" ]
			then
				echo "INFO: skipping application gate base href substitution"
			else
				echo "INFO: performing application gate base href substitution on index.html"
				sed -i -e 's~<base href="[^"]*".*>~<base href="'"$GATE_BASE_HREF"'" />~g' /var/www/index.html
				echo "INFO: replaced application gate base href"

				echo "INFO: generated index.html:"
				cat /var/www/index.html
    fi
	else
		echo "FATAL: nginx template configuration ${NGINX_CONF_TEMPLATE} not available"
		exit 1
fi

exec "$@"
