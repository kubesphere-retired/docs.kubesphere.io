FROM gatsbyjs/gatsby:latest
ADD public/ /pub/docs
RUN cp /pub/docs/404.html /pub/404.html