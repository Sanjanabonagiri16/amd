# AMD FastAPI Service

Minimal AMD service exposing `/predict`.

## Run
```
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Predict
```
curl -X POST http://127.0.0.1:8000/predict \
  -H 'Content-Type: application/json' \
  -d '{"audio_url": "https://example.com/machine.wav"}'
```

Response
```
{"label":"machine","confidence":0.9,"latency_ms":5,"details":{"rule":"url_contains_machine"}}
```
