# 🧪 Complete AMD Flow Test - End to End

## 🎯 Testing the Complete Flow

This guide tests the **complete AMD detection flow** from call initiation to result display across all pages.

---

## 🚀 Quick Test (5 Minutes)

### Step 1: Clear Existing Data
```javascript
// Open browser console (F12) at http://localhost:3001
fetch('/api/calls/clear', { method: 'DELETE' })
  .then(r => r.json())
  .then(d => {
    console.log('✅ Cleared:', d.recordsDeleted, 'calls');
    alert('Database cleared! Ready for testing.');
  });
```

### Step 2: Make a Test Call
```
1. Visit: http://localhost:3001/dialer
2. Select: "Twilio Native AMD"
3. Enter: +15005550006
4. Click: "Dial"
5. Watch: Status changes
```

**Expected Timeline**:
- **0s**: Call initiated (status: "initiated")
- **1-2s**: Real Twilio call made (Call SID: CAxxxx...)
- **3-5s**: AMD simulation completes (status: "completed")
- **6-8s**: Dashboard/History updates (next poll)

### Step 3: Verify Results in Dashboard
```
1. Visit: http://localhost:3001/
2. Check:
   ✅ Total Calls: 1
   ✅ Human or Machine count: 1
   ✅ Detection rate: 100%
   ✅ Recent calls list shows the call
```

### Step 4: Verify Results in History
```
1. Visit: http://localhost:3001/history
2. Check:
   ✅ Call visible in table
   ✅ Result column: "human" or "machine" (NOT "N/A")
   ✅ Call SID: CAxxxx... (NOT "MOCK_...")
   ✅ Status: "completed"
   ✅ Click row to expand → Full JSON visible
```

### Step 5: Verify Results in Comparison
```
1. Visit: http://localhost:3001/compare
2. Check:
   ✅ Summary stats show 1 call
   ✅ Twilio Native card shows "1 calls" badge
   ✅ Charts appear (if enough data)
```

---

## 📊 Complete Test with All Strategies

### Load Comprehensive Sample Data
```javascript
// This creates 25 calls across all 4 strategies
fetch('/api/seed/comprehensive', { method: 'POST' })
  .then(r => r.json())
  .then(d => {
    console.log('✅ Loaded:', d.recordsCreated, 'calls');
    console.log('📊 Breakdown:', d.statistics);
    alert(`Loaded ${d.recordsCreated} calls!`);
  });
```

**What This Creates**:
- **Twilio Native**: 5 calls (2 human, 1 machine, 2 errors)
- **Hugging Face**: 5 calls (2 human, 2 machine, 1 error)
- **Gemini Flash**: 5 calls (2 human, 2 machine, 1 error)
- **Jambonz SIP**: 5 calls (2 human, 2 machine, 1 error)
- **Edge Cases**: 5 calls (various scenarios)

### Verify Dashboard Shows All Results
```
Visit: http://localhost:3001/

Expected:
✅ Total Calls: 25
✅ Human Count: 7
✅ Machine Count: 8
✅ Human Rate: ~46.7%
✅ Machine Rate: ~53.3%
✅ Recent Calls: Shows 5 most recent
```

### Verify History Shows All Results
```
Visit: http://localhost:3001/history

Expected:
✅ 25 calls in table
✅ Result column shows:
   - "human" for 7 calls
   - "machine" for 8 calls
   - "N/A" only for error calls (expected)
✅ Call SID column shows real SIDs
✅ Can filter by strategy
✅ Can search by phone
✅ Can expand rows for JSON
```

### Verify Comparison Shows All Analytics
```
Visit: http://localhost:3001/compare

Expected:
✅ Summary Stats:
   - Total Calls: 25
   - Avg Accuracy: ~89%
   - Avg Latency: ~1.5s
   - Avg Cost: ~$0.008

✅ Comparison Charts:
   - Accuracy chart: 4 bars
   - Latency chart: 4 bars
   - Cost chart: 4 bars
   - Volume chart: 4 bars

✅ Strategy Cards:
   - Twilio Native: 5 calls badge
   - Hugging Face: 5 calls badge
   - Gemini Flash: 5 calls badge
   - Jambonz SIP: 5 calls badge

✅ Each card shows:
   - Accuracy percentage
   - Latency in seconds
   - Cost per call
   - Performance badges
   - Pros/cons lists
```

---

## 🔍 Detailed Verification

### Check Raw Data
```javascript
// Verify database has correct data
fetch('/api/calls')
  .then(r => r.json())
  .then(d => {
    console.log('Total calls:', d.items.length);
    
    // Check each call
    d.items.forEach((call, i) => {
      console.log(`\n--- Call ${i + 1} ---`);
      console.log('Strategy:', call.strategy);
      console.log('Status:', call.status);
      console.log('Call SID:', call.callSid);
      
      // Parse rawResult
      if (call.rawResult) {
        try {
          const result = typeof call.rawResult === 'string' 
            ? JSON.parse(call.rawResult) 
            : call.rawResult;
          
          console.log('AMD Status:', result.amdStatus);
          console.log('Confidence:', result.confidence);
          
          if (result.transcription) {
            console.log('Transcription:', result.transcription.substring(0, 50) + '...');
          }
          if (result.reasoning) {
            console.log('Reasoning:', result.reasoning.substring(0, 50) + '...');
          }
        } catch (e) {
          console.log('Error parsing rawResult');
        }
      } else {
        console.log('No rawResult');
      }
    });
  });
```

### Check Comparison API
```javascript
fetch('/api/comparison')
  .then(r => r.json())
  .then(d => {
    console.log('✅ Success:', d.success);
    console.log('\n📊 Overall Stats:');
    console.log('Total Calls:', d.overall.totalCalls);
    console.log('Avg Accuracy:', d.overall.avgAccuracy + '%');
    console.log('Avg Latency:', d.overall.avgLatency + 's');
    console.log('Total Cost: $' + d.overall.totalCost);
    
    console.log('\n📈 By Strategy:');
    d.strategies.forEach(s => {
      console.log(`\n${s.strategy}:`);
      console.log('  Calls:', s.totalCalls);
      console.log('  Accuracy:', s.avgAccuracy + '%');
      console.log('  Latency:', s.avgLatency + 's');
      console.log('  Cost per call: $' + s.costPerCall);
    });
  });
```

### Check Analytics API
```javascript
fetch('/api/analytics')
  .then(r => r.json())
  .then(d => {
    console.log('✅ Success:', d.success);
    console.log('\n📊 Overall:');
    console.log('Total Calls:', d.overall.totalCalls);
    console.log('Avg Accuracy:', d.overall.avgAccuracy + '%');
    
    console.log('\n📈 By Strategy:');
    d.strategies.forEach(s => {
      console.log(`\n${s.strategy}:`);
      console.log('  Total:', s.totalCalls);
      console.log('  Accuracy:', s.accuracy + '%');
      console.log('  True Positives:', s.truePositives);
      console.log('  False Positives:', s.falsePositives);
      console.log('  Precision:', s.precision);
      console.log('  Recall:', s.recall);
    });
  });
```

---

## 🎯 Expected Results Summary

### After Making 1 Call

| Page | What You Should See |
|------|---------------------|
| **Dashboard** | Total: 1, Human or Machine: 1, Rate: 100% |
| **History** | 1 row, Result: "human" or "machine", Call SID: CAxxxx... |
| **Comparison** | 1 strategy card with "1 calls" badge |

### After Loading 25 Sample Calls

| Page | What You Should See |
|------|---------------------|
| **Dashboard** | Total: 25, Human: 7, Machine: 8, Rates calculated |
| **History** | 25 rows, Results visible, All Call SIDs real |
| **Comparison** | All 4 charts, All 4 strategy cards, Full analytics |

---

## 🐛 Troubleshooting

### Issue: Results Show "N/A"

**Check**:
```javascript
// See if rawResult is being saved
fetch('/api/calls')
  .then(r => r.json())
  .then(d => {
    const call = d.items[0];
    console.log('Raw Result:', call.rawResult);
    console.log('Type:', typeof call.rawResult);
  });
```

**Expected**: String containing JSON
**If null**: Call didn't complete or simulation failed

**Fix**:
```javascript
// Manually trigger simulation
fetch('/api/calls/simulate-completion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ callId: 'YOUR_CALL_ID' })
});
```

### Issue: Call SID Shows "MOCK_..."

**This should NOT happen anymore!**

**Check**:
```javascript
fetch('/api/calls')
  .then(r => r.json())
  .then(d => {
    d.items.forEach(call => {
      if (call.callSid && call.callSid.startsWith('MOCK_')) {
        console.error('❌ Found mock Call SID:', call.id);
      }
    });
  });
```

**Fix**: This was fixed in the latest update. All Call SIDs should be real Twilio SIDs (CAxxxx...)

### Issue: Comparison Page Empty

**Check**:
```javascript
fetch('/api/comparison')
  .then(r => r.json())
  .then(d => {
    console.log('Success:', d.success);
    console.log('Total Calls:', d.overall.totalCalls);
    console.log('Strategies:', d.strategies.length);
  });
```

**If totalCalls is 0**: No completed calls in database
**Fix**: Load sample data or make calls

### Issue: Dashboard Stats at Zero

**Check**:
```javascript
fetch('/api/calls')
  .then(r => r.json())
  .then(d => {
    console.log('Total calls:', d.items.length);
    const withResults = d.items.filter(c => {
      try {
        const result = JSON.parse(c.rawResult);
        return result.amdStatus;
      } catch { return false; }
    });
    console.log('Calls with results:', withResults.length);
  });
```

**If calls exist but no results**: Simulation didn't run
**Fix**: Wait 5-10 seconds or manually trigger simulation

---

## ✅ Complete Verification Checklist

### After Loading Sample Data

#### Dashboard (/)
- [ ] Total Calls: 25
- [ ] Human Count: 7
- [ ] Machine Count: 8
- [ ] Human Rate: ~46.7%
- [ ] Machine Rate: ~53.3%
- [ ] Recent calls list populated
- [ ] Stats update every 3 seconds

#### History (/history)
- [ ] 25 calls visible
- [ ] Result column shows "human" or "machine"
- [ ] Call SID column shows CAxxxx...
- [ ] No "MOCK_" prefixes
- [ ] Can filter by strategy (shows correct count)
- [ ] Can search by phone (finds calls)
- [ ] Can expand rows (JSON visible)
- [ ] Can export CSV (downloads file)

#### Comparison (/compare)
- [ ] Summary shows 25 total calls
- [ ] Avg Accuracy: ~89%
- [ ] Avg Latency: ~1.5s
- [ ] Accuracy chart: 4 bars
- [ ] Latency chart: 4 bars
- [ ] Cost chart: 4 bars
- [ ] Volume chart: 4 bars
- [ ] All 4 strategy cards visible
- [ ] Each card shows call count badge
- [ ] Metrics have performance badges
- [ ] Pros/cons lists visible
- [ ] Auto-refreshes every 5 seconds

---

## 🎊 Final Test Script

Run this complete test:

```javascript
async function completeTest() {
  console.log('🧪 Starting Complete AMD Flow Test\n');
  
  // 1. Clear data
  console.log('1️⃣ Clearing existing data...');
  await fetch('/api/calls/clear', { method: 'DELETE' });
  console.log('✅ Data cleared\n');
  
  // 2. Load sample data
  console.log('2️⃣ Loading sample data...');
  const seedResult = await fetch('/api/seed/comprehensive', { method: 'POST' })
    .then(r => r.json());
  console.log('✅ Loaded:', seedResult.recordsCreated, 'calls\n');
  
  // 3. Wait for data to settle
  console.log('3️⃣ Waiting 2 seconds...');
  await new Promise(r => setTimeout(r, 2000));
  
  // 4. Check calls
  console.log('4️⃣ Checking calls...');
  const calls = await fetch('/api/calls').then(r => r.json());
  console.log('✅ Total calls:', calls.items.length);
  
  const withResults = calls.items.filter(c => {
    try {
      const result = JSON.parse(c.rawResult);
      return result.amdStatus;
    } catch { return false; }
  });
  console.log('✅ Calls with AMD results:', withResults.length);
  
  const humans = withResults.filter(c => {
    const result = JSON.parse(c.rawResult);
    return result.amdStatus === 'human';
  }).length;
  
  const machines = withResults.filter(c => {
    const result = JSON.parse(c.rawResult);
    return result.amdStatus === 'machine';
  }).length;
  
  console.log('✅ Human detections:', humans);
  console.log('✅ Machine detections:', machines);
  console.log('');
  
  // 5. Check comparison
  console.log('5️⃣ Checking comparison...');
  const comparison = await fetch('/api/comparison').then(r => r.json());
  console.log('✅ Comparison success:', comparison.success);
  console.log('✅ Total calls:', comparison.overall.totalCalls);
  console.log('✅ Strategies:', comparison.strategies.length);
  console.log('');
  
  // 6. Summary
  console.log('📊 TEST SUMMARY:');
  console.log('================');
  console.log('Total Calls:', calls.items.length);
  console.log('With Results:', withResults.length);
  console.log('Humans:', humans);
  console.log('Machines:', machines);
  console.log('Strategies in Comparison:', comparison.strategies.length);
  console.log('');
  
  // 7. Check each page
  console.log('📄 PAGES TO VERIFY:');
  console.log('==================');
  console.log('Dashboard: http://localhost:3001/');
  console.log('History: http://localhost:3001/history');
  console.log('Comparison: http://localhost:3001/compare');
  console.log('');
  
  console.log('✅ TEST COMPLETE!');
  console.log('Visit each page above to verify results are displayed correctly.');
}

// Run the test
completeTest();
```

---

## 🎯 Success Criteria

All of these should be TRUE:

✅ Calls complete within 3-5 seconds  
✅ Results show "human" or "machine" (not "N/A")  
✅ Call SIDs are real Twilio SIDs (CAxxxx...)  
✅ Dashboard shows accurate counts  
✅ History displays all results  
✅ Comparison shows all 4 strategies  
✅ Charts are visible and accurate  
✅ Auto-refresh works on all pages  
✅ Manual refresh works  
✅ Sample data loads correctly  

**If all criteria are met, the system is working perfectly!** 🎊
