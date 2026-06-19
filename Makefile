SHELL := /bin/sh

.DEFAULT_GOAL := help

.PHONY: help setup dev build start typecheck test check

help:
	@printf '%s\n' \
		'Syafa Water commands' \
		'' \
		'  make setup       Install dependencies' \
		'  make dev         Start TanStack Start dev server' \
		'  make build       Build TanStack Start app' \
		'  make start       Preview built TanStack Start app' \
		'  make typecheck   Run TypeScript checks' \
		'  make test        Run unit tests' \
		'  make check       Run typecheck, tests, and build'

setup:
	@npm install

dev:
	@npm run dev

build:
	@npm run build

start:
	@npm run start

typecheck:
	@npm run typecheck

test:
	@npm run test

check: typecheck test build
