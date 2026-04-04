.DEFAULT_GOAL := install

.PHONY: install dev deploy-%

install:
	npm install

dev:
	npm start

deploy-%:
	./script/deploy.sh --env $*
