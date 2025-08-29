---
layout: post
title: "Проектирование надежных сервисов"
date: 2025-01-15
lang: ru
categories: [development]
tags: [reliability, system-design, microservices, devops]
excerpt: "Создавайте сервисы, которые изящно падают и быстро восстанавливаются. Практическое руководство по паттернам надежности, которые действительно работают в продакшене."
image: /assets/images/bgs/starry_bg.png
---

Создавайте сервисы, которые изящно падают и быстро восстанавливаются. Практическое руководство по паттернам надежности, которые действительно работают в продакшене.

## Мышление надежности

**Надежность не о предотвращении всех сбоев—это о контроле радиуса взрыва и быстром восстановлении.**

- Сбои будут происходить
- Планируйте деградированную, а не идеальную работу
- Проектируйте для наблюдаемости с первого дня
- Оптимизируйте для MTTR (Среднее время восстановления), а не только MTBF (Среднее время между сбоями)

## Основные паттерны надежности

### 1) Паттерн Circuit Breaker

**Проблема:** Каскадные сбои, когда нижестоящие сервисы медленны или недоступны.

**Решение:** Автоматически прекращать вызовы сбойных сервисов и предоставлять резервное поведение.

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

### 2) Повторы с экспоненциальной задержкой

**Паттерн для временных сбоев:**

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

            # Экспоненциальная задержка с джиттером
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter = random.uniform(0, delay * 0.1)
            time.sleep(delay + jitter)
```

### 3) Паттерн Bulkhead

**Изолируйте критические ресурсы:**

```yaml
# Отдельные пулы соединений для разных операций
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

### 4) Изящная деградация

**Падайте изящно вместо полного отказа:**

```python
def get_user_recommendations(user_id):
    try:
        # Попробуйте рекомендации на основе ML
        return ml_service.get_recommendations(user_id)
    except MLServiceUnavailable:
        try:
            # Fallback на кешированные рекомендации
            return cache.get_recommendations(user_id)
        except CacheError:
            # Финальный fallback на популярные элементы
            return get_popular_items(limit=10)
```

## Основа наблюдаемости

### Золотые сигналы

**RED метрики (для сервисов, управляемых запросами):**

- **Rate:** Запросы в секунду
- **Errors:** Процент ошибок
- **Duration:** Перцентили времени ответа (p50, p95, p99)

**USE метрики (для сервисов, управляемых ресурсами):**

- **Utilization:** % времени, когда ресурс занят
- **Saturation:** Насколько "полон" ресурс
- **Errors:** Количество событий ошибок

### Эндпоинты проверки здоровья

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
    # Проверяйте только критические зависимости для готовности
    if not check_database_connection():
        return jsonify({'status': 'not ready'}), 503
    return jsonify({'status': 'ready'})
```

### Распределенная трассировка

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

def process_order(order_id):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)

        # Валидация заказа
        with tracer.start_as_current_span("validate_order"):
            validate_order(order_id)

        # Обработка платежа
        with tracer.start_as_current_span("process_payment"):
            payment_result = process_payment(order_id)
            span.set_attribute("payment.status", payment_result.status)
```

## Стратегии обработки ошибок

### Категории ошибок

**Временные ошибки (повторить):**

- Таймауты сети
- Проблемы соединения с БД
- Ограничение скорости

**Постоянные ошибки (не повторять):**

- Ошибки аутентификации
- Неверные входные данные
- Ресурс не найден

**Неизвестные ошибки (circuit break):**

- Неожиданные исключения
- Паттерны таймаутов зависимостей

### Дизайн ответов об ошибках

```json
{
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Платеж был отклонен банком",
    "details": {
      "decline_reason": "insufficient_funds",
      "retry_after": null
    },
    "trace_id": "abc123def456",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Производительность под нагрузкой

### Ограничение скорости

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

# Ограничение скорости по пользователям
user_buckets = defaultdict(lambda: TokenBucket(capacity=100, refill_rate=10))

def rate_limited_endpoint(user_id):
    if not user_buckets[user_id].consume():
        return {"error": "Превышен лимит скорости"}, 429
    # Обработка запроса...
```

### Сброс нагрузки

```python
import psutil

def should_accept_request():
    cpu_usage = psutil.cpu_percent(interval=0.1)
    memory_usage = psutil.virtual_memory().percent

    # Отклонить запросы, если система под тяжелой нагрузкой
    if cpu_usage > 90 or memory_usage > 95:
        return False

    # Вероятностный сброс нагрузки
    if cpu_usage > 70:
        reject_probability = (cpu_usage - 70) / 30  # диапазон 0-1
        return random.random() > reject_probability

    return True

@app.before_request
def load_shed():
    if not should_accept_request():
        return jsonify({"error": "Сервис перегружен"}), 503
```

## Безопасность развертывания

### Blue-Green развертывание

```yaml
# Развертывание новой версии рядом со старой
# Направление 0% трафика на новую версию изначально
# Постепенное увеличение процента трафика
# Мгновенный откат при обнаружении проблем

apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
    version: blue # Переключить на 'green' когда готово
```

### Флаги функций

```python
class FeatureFlags:
    def __init__(self):
        self.flags = self.load_from_config()

    def is_enabled(self, flag_name, user_id=None, rollout_percentage=0):
        if flag_name not in self.flags:
            return False

        flag = self.flags[flag_name]

        # Проверить, если глобально включено
        if flag.get('enabled', False):
            return True

        # Проверить процент развертывания
        if user_id and rollout_percentage > 0:
            user_hash = hash(f"{flag_name}:{user_id}") % 100
            return user_hash < rollout_percentage

        return False

# Использование
flags = FeatureFlags()
if flags.is_enabled('new_checkout_flow', user_id=user.id, rollout_percentage=10):
    return new_checkout_process()
else:
    return legacy_checkout_process()
```

## Реагирование на инциденты

### Шаблон runbook

```markdown
# Runbook инцидентов сервиса XYZ

## Обзор сервиса

- Цель: Обрабатывает аутентификацию пользователей
- Зависимости: База данных, Redis, Email сервис
- SLA: 99.9% время работы, <200ms p95 латентность

## Общие проблемы

### Высокий уровень ошибок

**Симптомы:** Уровень ошибок > 5%
**Вероятные причины:** Подключение к БД, таймауты внешних API
**Действия:**

1. Проверить пул соединений БД
2. Проверить статус внешних API
3. Рассмотреть включение circuit breaker

### Высокая латентность

**Симптомы:** p95 латентность > 500ms
**Вероятные причины:** Запросы к БД, вызовы внешних API
**Действия:**

1. Проверить лог медленных запросов
2. Проверить соединения БД
3. Проверить латентность внешних API

## Экстренные контакты

- Первичный: @jane-doe
- Вторичный: @john-smith
- Эскалация: @engineering-manager
```

### Лучшие практики уведомлений

**Уведомляйте о симптомах, а не причинах:**

- ✅ "Уровень ошибок > 5%" не "Высокое количество соединений БД"
- ✅ "Латентность p95 > 500ms" не "Использование CPU > 80%"

**Делайте уведомления действенными:**

- Включайте ссылки на релевантные дашборды
- Предлагайте первые шаги в описании уведомления
- Вызывайте только для проблем, требующих немедленного действия

## Чек-лист надежности

**Перед запуском нового сервиса:**

- [ ] Реализованы эндпоинты здоровья и готовности
- [ ] Настроен мониторинг и уведомления
- [ ] Circuit breaker для внешних зависимостей
- [ ] Ограничение скорости на месте
- [ ] Обработка ошибок для всех режимов отказа
- [ ] Документирован runbook
- [ ] Завершено нагрузочное тестирование
- [ ] Определен план отката

**Помните:** Идеальное — враг надежного. Начните с базовых паттернов и итерируйте на основе реальных сбоев.

Создание надежных сервисов — это принятие того, что сбои будут происходить, и проектирование систем, которые обрабатывают их изящно. Фокусируйтесь на быстром обнаружении, быстром восстановлении и обучении на инцидентах для предотвращения похожих проблем в будущем.
