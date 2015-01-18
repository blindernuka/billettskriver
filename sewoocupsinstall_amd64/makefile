VPATH = src:ppd:bin

ppds = SEWOOLKT.ppd.gz

DEFS=
LIBS=-lcupsimage -lcups

ifdef RPMBUILD
DEFS=-DRPMBUILD
LIBS=-ldl
endif

define dependencies
@if [ ! -e /usr/include/cups ]; then echo "CUPS headers not available - exiting"; exit 1; fi
@if ! (ls /usr/lib | grep libcups.* > /dev/null); then echo "libcups not available - exiting"; exit 1; fi
@if ! (ls /usr/lib | grep libcupsimage.* > /dev/null); then echo "libcupsimage not available - exiting"; exit 1; fi
endef

# define init
# @if [ ! -e bin ]; then echo "mkdir bin"; mkdir bin; fi
# endef

.PHONY: install
install: $(ppds)
	@if [ ! -e install ]; then echo "Please run make package first."; exit 1; fi
	# installing
	cp ppd/*.gz install
	cd install; exec ./setup

.PHONY: remove
remove:
	#removing from default location (other locations require manual removal)
	@if [ -e /usr/lib/cups/filter/rastertosewoo ]; then echo "Removing rastertosewoo"; rm -f /usr/lib/cups/filter/rastertosewoo; fi
	@if [ -d /usr/share/cups/model/SEWOO ]; then echo "Removing dir .../cups/model/SEWOO"; rm -rf /usr/share/cups/model/SEWOO; fi

.PHONY: help
help:
	# Help for VENDOR THERMAL PRINTER CUPS Driver make utility usage
	#
	# command          purpose
	# ------------------------------------
	# make install      execute the setup shell script from the install directory [ root user permissions required ]
	# make remove       removes installed files from your system (assumes default install lication) [ root user permissions required ]

$(ppds): %.ppd.gz: %.ppd
	# gzip ppd file
	gzip -c $< >> ppd/$@

