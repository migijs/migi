build:
	@gulp

build-test:
	@gulp build-test

init:
	@export SAUCE_USERNAME=army8735
  @export SAUCE_ACCESS_KEY=6edc1ec9-7e0d-43c8-8d75-e9d8456d11f9

test-firefox:
	@nightwatch --filter test.js

test-chrome:
	@nightwatch --filter test.js --env chrome

test-ie:
	@nightwatch --filter test.js --env ie

test-firefox-lie:
	@nightwatch --filter test-lie.js

test: build-test test-mocha test-firefox

test-lie: test-mocha-lie test-firefox-lie

test-mocha:
	@mocha --timeout 5000 tests/testm.js -R spec

test-mocha-lie:
	@mocha --timeout 5000 tests/testm-lie.js -R spec

coveralls: build-test
	@mocha --timeout 5000 tests/testm.js --require blanket --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

test-cov: build-test
	@mocha --timeout 5000 tests/testm.js --require blanket -R html-cov > tests/covrage.html

spm:
	@spm build -c
	@gulp spm

.PHONY: build