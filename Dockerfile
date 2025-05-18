FROM ubuntu:latest
LABEL authors="bugra"

ENTRYPOINT ["top", "-b"]