# Operational Runbook — BeCurious Platform

## Common Issues

### 1. Backend Not Starting
**Symptoms**: Container exits immediately, health check fails  
**Check**:
```bash
docker logs bounce-backend --tail 50
```
**Common causes**:
- Missing environment variables → Check `.env` file
- Database not ready → Check Postgres health
- Flyway migration conflict → Check migration checksums
**Resolution**: Fix env vars, restart. If migration conflict: `flyway repair`

---

### 2. Redis Connection Failure
**Symptoms**: Rate limiting disabled, cache misses, "fail-open" log messages  
**Check**:
```bash
redis-cli -h <host> -a <password> ping
```
**Impact**: Rate limiting + caching disabled (fail-open), sessions not tracked  
**Resolution**: Restart Redis, check connection config. System degrades gracefully.

---

### 3. Database Connection Pool Exhaustion
**Symptoms**: 500 errors, "Connection is not available" in logs  
**Check**: `GET /actuator/metrics/hikaricp.connections` (authorized only)  
**Resolution**:
1. Check for long-running queries: `SELECT * FROM pg_stat_activity WHERE state = 'active'`
2. Kill stuck queries: `SELECT pg_terminate_backend(pid)`
3. Increase pool size if sustained (max 20 recommended)

---

### 4. High Engagement Event Backlog
**Symptoms**: Async queue growing, events delayed  
**Check**: Application logs for "engagement task rejected"  
**Resolution**: Increase executor pool size in `AsyncConfig.java`, or scale backend instances

---

## Deployment Procedure

1. **Pre-deploy**: Run CI pipeline, all tests green
2. **Database**: Flyway runs automatically on startup — verify migration status
3. **Deploy**: `docker-compose pull && docker-compose up -d`
4. **Verify**: Check `/actuator/health` returns UP
5. **Smoke test**: Log in, view a level, check engagement API responds

## Rollback Procedure

1. **Immediate rollback**: `docker-compose down && git checkout <prev-tag> && docker-compose up -d`
2. **Database rollback**: Flyway does NOT support down migrations. Use point-in-time recovery from backup.
3. **Hotfix**: Branch from previous release tag, fix, deploy.

## Incident Response Template

```
Incident: [Title]
Severity: [Critical/High/Medium/Low]
Started: [Timestamp]
Detected: [How it was detected]
Impact: [What users are affected]
Timeline:
- HH:MM - Event
- HH:MM - Action taken
Root Cause: [Description]
Resolution: [What fixed it]
Prevention: [What changes prevent recurrence]
```
