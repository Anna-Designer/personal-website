---
layout: post
title: "Designing Reliable Services"
date: 2025-01-15
lang: en
categories: [development]
tags: [reliability, system-design, microservices, devops]
excerpt: "Build services that fail gracefully and recover quickly. A practical guide to reliability patterns that actually work in production."
image: /assets/images/bgs/starry_bg.png
---

Build services that fail gracefully and recover quickly. A practical guide to reliability patterns that actually work in production.

## The Reliability Mindset

**Reliability isn't about preventing all failures—it's about controlling blast radius and recovering quickly.**

- Failures will happen
- Plan for degraded, not perfect, operation
- Design for observability from day one
- Optimize for MTTR (Mean Time To Recovery), not just MTBF (Mean Time Between Failures)

## Core Reliability Patterns

### 1) Circuit Breaker Pattern

**Problem:** Cascading failures when downstream services are slow or unavailable.

**Solution:** Automatically stop calling failing services and provide fallback behavior.

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN

    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = 'HALF_OPEN'
            else:
                raise CircuitBreakerOpenError()

        try:
            result = func(*args, **kwargs)
            self.reset()
            return result
        except Exception as e:
            self.record_failure()
            raise e

    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
```

### 2) Retry with Exponential Backoff

**Pattern for transient failures:**

```python
import random
import time

def retry_with_backoff(func, max_retries=3, base_delay=1, max_delay=60):
    for attempt in range(max_retries + 1):
        try:
            return func()
        except RetryableError as e:
            if attempt == max_retries:
                raise e

            # Exponential backoff with jitter
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter = random.uniform(0, delay * 0.1)
            time.sleep(delay + jitter)
```

### 3) Bulkhead Pattern

**Isolate critical resources:**

```yaml
# Separate connection pools for different operations
databases:
  user_reads:
    max_connections: 10
    timeout: 5s
  user_writes:
    max_connections: 5
    timeout: 30s
  analytics:
    max_connections: 2
    timeout: 60s
```

### 4) Graceful Degradation

**Fail gracefully instead of failing completely:**

```python
def get_user_recommendations(user_id):
    try:
        # Try ML-powered recommendations
        return ml_service.get_recommendations(user_id)
    except MLServiceUnavailable:
        try:
            # Fallback to cached recommendations
            return cache.get_recommendations(user_id)
        except CacheError:
            # Final fallback to popular items
            return get_popular_items(limit=10)
```

## Observability Foundation

### The Golden Signals

**RED Metrics (for request-driven services):**

- **Rate:** Requests per second
- **Errors:** Error rate percentage
- **Duration:** Response time percentiles (p50, p95, p99)

**USE Metrics (for resource-driven services):**

- **Utilization:** % time resource is busy
- **Saturation:** How "full" the resource is
- **Errors:** Count of error events

### Health Check Endpoints

```python
@app.route('/health')
def health_check():
    checks = {
        'database': check_database_connection(),
        'cache': check_cache_connection(),
        'external_api': check_external_api(),
    }

    is_healthy = all(checks.values())
    status_code = 200 if is_healthy else 503

    return jsonify({
        'status': 'healthy' if is_healthy else 'unhealthy',
        'checks': checks,
        'timestamp': datetime.utcnow().isoformat()
    }), status_code

@app.route('/ready')
def readiness_check():
    # Only check critical dependencies for readiness
    if not check_database_connection():
        return jsonify({'status': 'not ready'}), 503
    return jsonify({'status': 'ready'})
```

### Distributed Tracing

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

def process_order(order_id):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)

        # Validate order
        with tracer.start_as_current_span("validate_order"):
            validate_order(order_id)

        # Process payment
        with tracer.start_as_current_span("process_payment"):
            payment_result = process_payment(order_id)
            span.set_attribute("payment.status", payment_result.status)
```

## Error Handling Strategies

### Error Categories

**Transient Errors (retry):**

- Network timeouts
- Database connection issues
- Rate limiting

**Permanent Errors (don't retry):**

- Authentication failures
- Invalid input data
- Resource not found

**Unknown Errors (circuit break):**

- Unexpected exceptions
- Dependency timeout patterns

### Error Response Design

```json
{
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Payment was declined by the bank",
    "details": {
      "decline_reason": "insufficient_funds",
      "retry_after": null
    },
    "trace_id": "abc123def456",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Performance Under Load

### Rate Limiting

```python
from collections import defaultdict
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()

    def consume(self, tokens=1):
        self._refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False

    def _refill(self):
        now = time.time()
        tokens_to_add = (now - self.last_refill) * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + tokens_to_add)
        self.last_refill = now

# Per-user rate limiting
user_buckets = defaultdict(lambda: TokenBucket(capacity=100, refill_rate=10))

def rate_limited_endpoint(user_id):
    if not user_buckets[user_id].consume():
        return {"error": "Rate limit exceeded"}, 429
    # Process request...
```

### Load Shedding

```python
import psutil

def should_accept_request():
    cpu_usage = psutil.cpu_percent(interval=0.1)
    memory_usage = psutil.virtual_memory().percent

    # Reject requests if system is under heavy load
    if cpu_usage > 90 or memory_usage > 95:
        return False

    # Probabilistic load shedding
    if cpu_usage > 70:
        reject_probability = (cpu_usage - 70) / 30  # 0-1 range
        return random.random() > reject_probability

    return True

@app.before_request
def load_shed():
    if not should_accept_request():
        return jsonify({"error": "Service overloaded"}), 503
```

## Deployment Safety

### Blue-Green Deployment

```yaml
# Deploy new version alongside old
# Route 0% traffic to new version initially
# Gradually increase traffic percentage
# Rollback instantly if issues detected

apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
    version: blue # Switch to 'green' when ready
```

### Feature Flags

```python
class FeatureFlags:
    def __init__(self):
        self.flags = self.load_from_config()

    def is_enabled(self, flag_name, user_id=None, rollout_percentage=0):
        if flag_name not in self.flags:
            return False

        flag = self.flags[flag_name]

        # Check if globally enabled
        if flag.get('enabled', False):
            return True

        # Check rollout percentage
        if user_id and rollout_percentage > 0:
            user_hash = hash(f"{flag_name}:{user_id}") % 100
            return user_hash < rollout_percentage

        return False

# Usage
flags = FeatureFlags()
if flags.is_enabled('new_checkout_flow', user_id=user.id, rollout_percentage=10):
    return new_checkout_process()
else:
    return legacy_checkout_process()
```

## Incident Response

### Runbook Template

```markdown
# Service XYZ Incident Runbook

## Service Overview

- Purpose: Handles user authentication
- Dependencies: Database, Redis, Email service
- SLA: 99.9% uptime, <200ms p95 latency

## Common Issues

### High Error Rate

**Symptoms:** Error rate > 5%
**Likely Causes:** Database connectivity, external API timeouts
**Actions:**

1. Check database connection pool
2. Review external API status
3. Consider enabling circuit breaker

### High Latency

**Symptoms:** p95 latency > 500ms
**Likely Causes:** Database queries, external API calls
**Actions:**

1. Check slow query log
2. Review database connections
3. Check external API latency

## Emergency Contacts

- Primary: @jane-doe
- Secondary: @john-smith
- Escalation: @engineering-manager
```

### Alerting Best Practices

**Alert on symptoms, not causes:**

- ✅ "Error rate > 5%" not "Database connection count high"
- ✅ "Latency p95 > 500ms" not "CPU usage > 80%"

**Make alerts actionable:**

- Include relevant dashboard links
- Suggest first steps in alert description
- Page only for issues requiring immediate action

## The Reliability Checklist

**Before launching a new service:**

- [ ] Health and readiness endpoints implemented
- [ ] Monitoring and alerting configured
- [ ] Circuit breakers for external dependencies
- [ ] Rate limiting in place
- [ ] Error handling for all failure modes
- [ ] Runbook documented
- [ ] Load testing completed
- [ ] Rollback plan defined

**Remember:** Perfect is the enemy of reliable. Start with basic patterns and iterate based on actual failures.

Building reliable services is about accepting that failures will happen and designing systems that handle them gracefully. Focus on fast detection, quick recovery, and learning from incidents to prevent similar issues in the future.
