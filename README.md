# Wader
The migration endpoint for IndieHosters infrastructure

## What

This endpoint allows 2 things.

1. `/download/:hash` Get an archive from your domain

Imagine you are using a Software as a Service. You are worried because they might [stop their business](https://indiewebcamp.com/site-deaths).
With IndieHosters, at what ever moment, you can get a full archive of your running web application!

2. `/migrate/:hash` Unattended migration

You could also decide to move from one provider to another. This is possible also, we stop properly your running web app, do the necessary dumps and send a zip.
This will also point the current HA to your IP address (not yet implemented).

## How

The only thing you need is to ask your Hosting Provider the secret hash linked to your domain. This hash should be kept secret.
(Anyone with access to it, can access your running app)

## Why Wader

Because there are [cute migrants birds](https://en.wikipedia.org/wiki/Wader) :) And as it is about migration!
