"use strict";
/**
 * Lua scripts for Redis rate limiting operations
 * These scripts ensure atomic operations for rate limiting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenBucketRemainingScript = exports.tokenBucketScript = exports.slidingWindowRemainingScript = exports.slidingWindowScript = exports.fixedWindowRemainingScript = exports.fixedWindowScript = void 0;
/**
 * Fixed Window Rate Limiting
 *
 * Each request inside a fixed time window increases a counter.
 * Once the counter reaches the maximum, all further requests are rejected.
 *
 * KEYS[1] = rate limit key
 * ARGV[1] = max tokens (limit)
 * ARGV[2] = window size in ms
 * ARGV[3] = increment by (default 1)
 *
 * Returns: [current_count, limit]
 */
exports.fixedWindowScript = "\nlocal key         = KEYS[1]\nlocal tokens      = tonumber(ARGV[1])\nlocal window      = ARGV[2]\nlocal incrementBy = tonumber(ARGV[3])\n\nlocal r = redis.call(\"INCRBY\", key, incrementBy)\nif r == incrementBy then\n  redis.call(\"PEXPIRE\", key, window)\nend\n\nreturn {r, tokens}\n";
/**
 * Fixed Window Remaining Tokens
 *
 * KEYS[1] = rate limit key
 * ARGV[1] = max tokens (limit)
 *
 * Returns: [remaining, limit]
 */
exports.fixedWindowRemainingScript = "\nlocal key = KEYS[1]\nlocal tokens = tonumber(ARGV[1])\n\nlocal value = redis.call('GET', key)\nlocal usedTokens = 0\nif value then\n  usedTokens = tonumber(value)\nend\n\nreturn {tokens - usedTokens, tokens}\n";
/**
 * Sliding Window Rate Limiting
 *
 * Combines a weighted score between two windows for smoother rate limiting.
 * Prevents the boundary burst problem of fixed windows.
 *
 * KEYS[1] = current window key
 * KEYS[2] = previous window key
 * ARGV[1] = max tokens (limit)
 * ARGV[2] = current timestamp in ms
 * ARGV[3] = window size in ms
 * ARGV[4] = increment by (default 1)
 *
 * Returns: [remaining, limit] or [-1, limit] if blocked
 */
exports.slidingWindowScript = "\nlocal currentKey  = KEYS[1]\nlocal previousKey = KEYS[2]\nlocal tokens      = tonumber(ARGV[1])\nlocal now         = tonumber(ARGV[2])\nlocal window      = tonumber(ARGV[3])\nlocal incrementBy = tonumber(ARGV[4])\n\nlocal requestsInCurrentWindow = redis.call(\"GET\", currentKey)\nif requestsInCurrentWindow == false then\n  requestsInCurrentWindow = 0\nelse\n  requestsInCurrentWindow = tonumber(requestsInCurrentWindow)\nend\n\nlocal requestsInPreviousWindow = redis.call(\"GET\", previousKey)\nif requestsInPreviousWindow == false then\n  requestsInPreviousWindow = 0\nelse\n  requestsInPreviousWindow = tonumber(requestsInPreviousWindow)\nend\n\nlocal percentageInCurrent = (now % window) / window\nrequestsInPreviousWindow = math.floor((1 - percentageInCurrent) * requestsInPreviousWindow)\n\nif incrementBy > 0 and requestsInPreviousWindow + requestsInCurrentWindow >= tokens then\n  return {-1, tokens}\nend\n\nlocal newValue = redis.call(\"INCRBY\", currentKey, incrementBy)\nif newValue == incrementBy then\n  redis.call(\"PEXPIRE\", currentKey, window * 2 + 1000)\nend\n\nreturn {tokens - (newValue + requestsInPreviousWindow), tokens}\n";
/**
 * Sliding Window Remaining Tokens
 *
 * KEYS[1] = current window key
 * KEYS[2] = previous window key
 * ARGV[1] = max tokens (limit)
 * ARGV[2] = current timestamp in ms
 * ARGV[3] = window size in ms
 *
 * Returns: [remaining, limit]
 */
exports.slidingWindowRemainingScript = "\nlocal currentKey  = KEYS[1]\nlocal previousKey = KEYS[2]\nlocal tokens      = tonumber(ARGV[1])\nlocal now         = tonumber(ARGV[2])\nlocal window      = tonumber(ARGV[3])\n\nlocal requestsInCurrentWindow = redis.call(\"GET\", currentKey)\nif requestsInCurrentWindow == false then\n  requestsInCurrentWindow = 0\nelse\n  requestsInCurrentWindow = tonumber(requestsInCurrentWindow)\nend\n\nlocal requestsInPreviousWindow = redis.call(\"GET\", previousKey)\nif requestsInPreviousWindow == false then\n  requestsInPreviousWindow = 0\nelse\n  requestsInPreviousWindow = tonumber(requestsInPreviousWindow)\nend\n\nlocal percentageInCurrent = (now % window) / window\nrequestsInPreviousWindow = math.floor((1 - percentageInCurrent) * requestsInPreviousWindow)\n\nlocal usedTokens = requestsInPreviousWindow + requestsInCurrentWindow\nreturn {tokens - usedTokens, tokens}\n";
/**
 * Token Bucket Rate Limiting
 *
 * A bucket filled with tokens that refills at a constant rate.
 * Allows bursts up to the bucket size while maintaining an average rate.
 *
 * KEYS[1] = bucket key
 * ARGV[1] = max tokens (bucket size)
 * ARGV[2] = refill interval in ms
 * ARGV[3] = refill rate (tokens per interval)
 * ARGV[4] = current timestamp in ms
 * ARGV[5] = tokens to consume (default 1)
 *
 * Returns: [remaining, reset_timestamp, limit] or [-1, reset_timestamp, limit] if blocked
 */
exports.tokenBucketScript = "\nlocal key         = KEYS[1]\nlocal maxTokens   = tonumber(ARGV[1])\nlocal interval    = tonumber(ARGV[2])\nlocal refillRate  = tonumber(ARGV[3])\nlocal now         = tonumber(ARGV[4])\nlocal incrementBy = tonumber(ARGV[5])\n\nlocal bucket = redis.call(\"HMGET\", key, \"refilledAt\", \"tokens\")\n\nlocal refilledAt\nlocal tokens\n\nif bucket[1] == false then\n  refilledAt = now\n  tokens = maxTokens\nelse\n  refilledAt = tonumber(bucket[1])\n  tokens = tonumber(bucket[2])\nend\n\nif now >= refilledAt + interval then\n  local numRefills = math.floor((now - refilledAt) / interval)\n  tokens = math.min(maxTokens, tokens + numRefills * refillRate)\n  refilledAt = refilledAt + numRefills * interval\nend\n\nif tokens == 0 and incrementBy > 0 then\n  return {-1, refilledAt + interval, maxTokens}\nend\n\nlocal remaining = tokens - incrementBy\nlocal expireAt = math.ceil(((maxTokens - remaining) / refillRate)) * interval\n\nredis.call(\"HSET\", key, \"refilledAt\", refilledAt, \"tokens\", remaining)\n\nif expireAt > 0 then\n  redis.call(\"PEXPIRE\", key, expireAt)\nend\n\nreturn {remaining, refilledAt + interval, maxTokens}\n";
/**
 * Token Bucket Remaining Tokens
 *
 * KEYS[1] = bucket key
 * ARGV[1] = max tokens (bucket size)
 * ARGV[2] = refill interval in ms
 * ARGV[3] = refill rate (tokens per interval)
 * ARGV[4] = current timestamp in ms
 *
 * Returns: [remaining, reset_timestamp, limit]
 */
exports.tokenBucketRemainingScript = "\nlocal key         = KEYS[1]\nlocal maxTokens   = tonumber(ARGV[1])\nlocal interval    = tonumber(ARGV[2])\nlocal refillRate  = tonumber(ARGV[3])\nlocal now         = tonumber(ARGV[4])\n\nlocal bucket = redis.call(\"HMGET\", key, \"refilledAt\", \"tokens\")\n\nif bucket[1] == false then\n  return {maxTokens, now + interval, maxTokens}\nend\n\nlocal refilledAt = tonumber(bucket[1])\nlocal tokens = tonumber(bucket[2])\n\nif now >= refilledAt + interval then\n  local numRefills = math.floor((now - refilledAt) / interval)\n  tokens = math.min(maxTokens, tokens + numRefills * refillRate)\nend\n\nreturn {tokens, refilledAt + interval, maxTokens}\n";
