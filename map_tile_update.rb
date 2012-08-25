require "redis"

redis = Redis.new

mapname = "map"
row = 3
col = 10

puts redis.lset("map:row#{row}",col,"s");