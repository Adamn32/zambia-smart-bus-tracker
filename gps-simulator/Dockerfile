# ----------------------------------------------------------------------------
# Project     : Zambia Smart Bus Tracker
# Module      : Dockerfile
# Author      : Adam ChapChap Ng'uni
# Date        : 2026-03-20
# Time        : 10:54:11 CAT
# Description :
#   Builds the simulator container that emits mock GPS events.
#
#   This file's role in the codebase:
#     - installs Python runtime dependencies for simulator script
#     - copies telemetry generator code into container image
#     - defines default command that starts continuous data posting
#
# Notes:
#   Simulator command and package versions affect payload cadence and stability.
# ----------------------------------------------------------------------------

FROM python:3.11-slim
WORKDIR /app
COPY simulator.py .
RUN pip install requests
CMD ["python","simulator.py"]
