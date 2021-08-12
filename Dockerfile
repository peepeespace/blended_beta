FROM node:14
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
EXPOSE 8082