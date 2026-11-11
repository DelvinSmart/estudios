import subprocess
M=[
('src/utils/appFiscalDay.ts',"[UBER_APP_ID]: { resetHour: 4,","[UBER_APP_ID]: { resetHour: 5,","Uber vira às 05:00"),
('src/utils/appFiscalDay.ts',"previous.setDate(previous.getDate() - 1);","previous.setDate(previous.getDate() - 0);","Ontem Uber igual a Hoje"),
('src/utils/earningsCalculations.ts',"if (legacy.length > 0) {","if (legacy.length > 99) {","ignora lançamentos do dia"),
('src/utils/earningsCalculations.ts',"records.map((record) => normalizeFiscalAppId(record.appId))","records.map((record) => record.appId)","Uber em dobro"),
('src/utils/earningsCalculations.ts',"record.entryKind !== 'daily_balance' && record.entryKind !== 'adjustment'","record.entryKind !== 'daily_balance'","adjustment entra no saldo"),
('src/utils/earningsCalculations.ts',"const delta = Math.round((reported - previous) * 100) / 100;","const delta = Math.round((reported + previous) * 100) / 100;","acumulado soma em vez de subtrair"),
('src/utils/earningsCalculations.ts',"return Math.round(safeAmount(record.amountBrl) * 100) === targetCents;","return safeAmount(record.amountBrl) === amountBrl;","duplicado sem centavos"),
('src/utils/earningsCalculations.ts',"return fiscalDayKey === selectedKey;","return fiscalDayKey !== selectedKey;","calendário invertido"),
('src/utils/expenseCalculations.ts',"return records.reduce((sum, record) => sum + safeAmount(record.amountBrl), 0);","return records.reduce((sum, record) => sum + record.amountBrl, 0);","gasto com NaN"),
('src/utils/spendingPeriodRange.ts',"const diff = day === 0 ? 6 : day - 1;","const diff = day;","semana começa no domingo"),
('src/utils/goalProgress.ts',"return Math.min(100, Math.round((earnedBrl / targetBrl) * 100));","return Math.round((earnedBrl / targetBrl) * 100);","meta passa de 100"),
('src/utils/goalProgress.ts',"if (earnedBrl >= targetBrl) return earnedBrl > targetBrl ? 'exceeded' : 'reached';","if (earnedBrl > targetBrl) return 'exceeded';","meta exata não conta"),
('src/utils/goalProgress.ts',"return previousTotalBrl < targetBrl && newTotalBrl >= targetBrl;","return newTotalBrl >= targetBrl;","aviso de meta repete"),
('src/utils/grupoSanCalculations.ts',"if (recipient?.countsOwnHand === false) return Math.max(base - group.monthlyFeeBrl, 0);\n","","San ignora Contar tu mano"),
('src/utils/grupoSanCalculations.ts',"return manoDay < today;","return manoDay <= today;","mão passa no próprio dia"),
('src/utils/grupoSanCalculations.ts',"const manos = group.participants.filter((item) => item.participantStatus !== 'withdrawn').length;","const manos = group.participants.length;","quem saiu conta no total"),
('src/utils/grupoSanCalculations.ts',"const pendingAmount = (pendingCount + lateCount) * group.monthlyFeeBrl;","const pendingAmount = pendingCount * group.monthlyFeeBrl;","atrasados fora do pendente"),
('src/utils/grupoSanCalculations.ts',"if (withSemaphores.status === 'cancelled') {","if (false) {","cancelado muda"),
('src/utils/goalProjection.ts',"weekly: projectWeeklyGoalFromDaily(daily, workDays),","weekly: daily * 7,","meta semanal ignora dias de trabalho"),
]
caught=0; bad=[]
for p,a,b,name in M:
    o=open(p).read()
    if a not in o: print('NO-APLICA',name); bad.append(name); continue
    open(p,'w').write(o.replace(a,b,1))
    try:
        r=subprocess.run("TZ=America/Sao_Paulo npx jest --silent 2>&1 | grep -E '^Tests:'",shell=True,capture_output=True,text=True,timeout=120)
    finally:
        open(p,'w').write(o)
    ok='failed' in r.stdout
    print(('CAZADO ' if ok else 'ESCAPÓ '),name,'|',r.stdout.strip().replace('Tests:','').strip())
    if ok: caught+=1
    else: bad.append(name)
print(f'{caught}/{len(M)} cazados'); print('escaparon:',bad)
