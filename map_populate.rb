require "redis"

redis = Redis.new

for i in 0..100 
	
	for j in 0..100
	
	redis.set("world1:row#{i}:col#{j}",0)
	
	end
end

puts "all is well, end of script."

