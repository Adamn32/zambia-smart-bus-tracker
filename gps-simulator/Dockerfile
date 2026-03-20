# ----------------------------------------------------------------------------
# Project     : Zambia Smart Bus Tracker
# Module      : Dockerfile
# Author      : Adam ChapChap Ng'uni
# Date        : 2026-03-20
# Time        : 10:54:11 CAT
# Description : Container build instructions for the GPS simulator service.
# ----------------------------------------------------------------------------

FROM python:3.11-slim
WORKDIR /app
COPY simulator.py .
RUN pip install requests
CMD ["python","simulator.py"]
