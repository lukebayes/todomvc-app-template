# Operating System
PLATFORM:=$(shell uname | tr A-Z a-z)
ARCH=x64

PROJECT_ROOT=$(shell git rev-parse --show-toplevel)

# Nodejs
NODE_VERSION=7.2.0
NODE=$(PROJECT_ROOT)/lib/nodejs/bin/node
NPM=$(PROJECT_ROOT)/lib/nodejs/bin/npm

# Derived values
NODE_FILENAME=node-v$(NODE_VERSION)-$(PLATFORM)-$(ARCH)
TEST_FILES=`find . -name "*_test.js" ! -path "*node_modules*" ! -path "*lib*"`
ROOT_NODE_MODULES=$(PROJECT_ROOT)/node_modules
NODE_MODULES_BIN=$(ROOT_NODE_MODULES)/.bin

# Node utilities
ESLINT=$(NODE_MODULES_BIN)/eslint
MOCHA=$(NODE_MODULES_BIN)/_mocha
WEBPACK=$(NODE_MODULES_BIN)/webpack
BABEL_NODE=$(NODE_MODULES_BIN)/babel-node
NOMPLATE=$(NODE_MODULES_BIN)/nomplate
WEBPACK_CLIENT_CONFIG=$(PROJECT_ROOT)/webpack-client.config.js
WEBPACK_SERVER_CONFIG=$(PROJECT_ROOT)/webpack-server.config.js

ifeq ($(NODE_ENV),production)
  IS_PRETTY=""
else
  IS_PRETTY="--pretty"
endif

.PHONY: test test-w build-client build-server serve lint clean integrate

build: build-client dist/index.html

dev-install: $(NODE) $(ROOT_NODE_MODULES)

# Run all JavaScript tests
test: dev-install
	${MOCHA} --reporter dot ${TEST_FILES}

test-w: dev-install
	${MOCHA} --reporter dot ${TEST_FILES} -w

build-client: dist/static/todomvc.js dist/static/todomvc.min.gz dist/static/base.css dist/static/index.css

build-server: dist/server.js

dist/static/base.css: dist/static js/*
	cp node_modules/todomvc-common/base.css dist/static/base.css

dist/static/index.css: dist/static js/*
	cp node_modules/todomvc-app-css/index.css dist/static/index.css

dist/static/todomvc.js: dist/static js/*
	$(WEBPACK) --config $(WEBPACK_CLIENT_CONFIG) client.js dist/static/todomvc.js

dist/static/todomvc.min.js: dist/static js/*
	$(WEBPACK) --optimize-minimize --config $(WEBPACK_CLIENT_CONFIG) client.js dist/static/todomvc.min.js

dist/static/todomvc.min.gz: dist/static/todomvc.min.js
	gzip --best -c dist/static/todomvc.min.js > dist/static/todomvc.min.gz

dist/index.html: dist/static js/*
	$(NOMPLATE) $(IS_PRETTY) js/index_view.js > dist/index.html

dist/static:
	mkdir -p dist/static
	
lint:
	$(ESLINT) --config $(PROJECT_ROOT)/.eslintrc.json .

integrate: clean lint build test

clean: 
	rm -rf dist
	rm -rf tmp

# Download and unpack the Node binaries into lib/nodejs.
$(NODE):
	mkdir -p tmp
	wget -O tmp/nodejs.tar.xz "https://nodejs.org/dist/v$(NODE_VERSION)/$(NODE_FILENAME).tar.xz"
	touch tmp/nodejs.tar.xz
	mkdir -p lib/nodejs
	tar -xvf tmp/nodejs.tar.xz -C lib/nodejs --strip 1
	touch lib/nodejs/README.md
	rm -rf tmp

$(ROOT_NODE_MODULES): $(PROJECT_ROOT)/package.json
	$(NPM) install --prefix=$(PROJECT_ROOT) --development

