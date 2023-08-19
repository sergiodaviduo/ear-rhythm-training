FROM node:19

RUN mkdir -p /app/ear
WORKDIR /app/ear

COPY requirements.txt .

RUN apt update \
	&& apt install -y software-properties-common \
	&& apt install -y apt-utils \
	&& apt install -y python3 \
	&& apt install -y pip \
	&& pip install -r requirements.txt \
	&& apt update

WORKDIR /app/ear

ENV NODE_ENV=container

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8000

CMD npm start

