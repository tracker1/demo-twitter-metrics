# Redis for Twitter metrics demo

Using redis as a data store here, can be configured with persistence or only for
temporary use. It's a good fit for this type of data tracking.

## Expiration

With the ability in redis to set expiration, don't need to worry about cleaning
up old data.. will set expiration to 50 hours, allowing a sliding window of the
past 48 hours safely (not including current hour in aggregated results).

## Tweet Count

Will keep an incrementing count for each hour, allowing selection/aggregation of
the past 24 hours

## Top N Tags

Sorted sets for each hour, adding a specific incrementing value for each tag.
Will allow for a sliding window for the top N tags per hour.

Example:
https://medium.com/@bhagavathidhass/redis-show-top-10-stat-in-24-hrs-e2520887e8f9
