$sueldosBase = @{ tecnico = 750000; ingeniero = 980000 }
$multRegion = @{
    arica=1.10; tarapaca=1.35; antofagasta=1.50; atacama=1.30
    coquimbo=1.05; valparaiso=1.05; metropolitana=1.0; ohiggins=0.95
    maule=0.90; nuble=0.88; biobio=0.95; araucania=0.88
    los_rios=0.90; los_lagos=0.92; aysen=1.20; magallanes=1.30
}
$multRubro = @{ retail_servicios=1.0; construccion_logistica=1.20; mineria_energy=1.50 }
$multExp   = @{ junior=1.0; semi_senior=1.25; senior=1.5 }

function Calcular($f, $r, $ru, $e) {
    return $sueldosBase[$f] * $multRegion[$r] * $multRubro[$ru] * $multExp[$e]
}

function Fmt($n) {
    return '$' + [math]::Round($n).ToString('N0').Replace(',','.')
}

$casos = @(
    [pscustomobject]@{label="PRUEBA 1 - Ing/Antofagasta/Mineria/Senior";     f="ingeniero"; r="antofagasta";    ru="mineria_energy";          e="senior";     ofrecido=800000},
    [pscustomobject]@{label="PRUEBA 2 - Ing/Antofagasta/Mineria/Senior";     f="ingeniero"; r="antofagasta";    ru="mineria_energy";          e="senior";     ofrecido=2200000},
    [pscustomobject]@{label="PRUEBA 3 - Tec/RM/Retail/Junior";               f="tecnico";   r="metropolitana";  ru="retail_servicios";        e="junior";     ofrecido=700000},
    [pscustomobject]@{label="PRUEBA 4 - Tec/Magallanes/Construccion/Semi";   f="tecnico";   r="magallanes";     ru="construccion_logistica";  e="semi_senior"; ofrecido=1000000}
)

Write-Host "=== RadarAPR - Verificacion de Logica Salarial ===" -ForegroundColor Cyan
Write-Host ""

foreach ($c in $casos) {
    $sug = Calcular $c.f $c.r $c.ru $c.e
    $umb = $sug * 0.95
    $ok  = $c.ofrecido -ge $umb

    Write-Host $c.label -ForegroundColor Yellow
    Write-Host ("  Sueldo Sugerido : " + (Fmt $sug))
    Write-Host ("  Sueldo Ofrecido : " + (Fmt $c.ofrecido))
    Write-Host ("  Umbral 95pct    : " + (Fmt $umb))
    if ($ok) {
        Write-Host "  Resultado       : COMPETITIVO" -ForegroundColor Green
    } else {
        Write-Host "  Resultado       : BAJO EL MERCADO" -ForegroundColor Red
    }
    Write-Host ""
}
