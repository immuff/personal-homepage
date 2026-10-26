$ErrorActionPreference = 'Stop'
$repoPath = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $repoPath
try {
    $branch = (& git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or $branch -ne 'main') { throw 'Run from the main branch of personal-homepage.' }
    $files = @(
        'README.md',
        'backend/seed.json',
        'backend/tests/test_api.py',
        'content/agent-rag/03-rag-retrieval-design.md',
        'deploy/publish_rag_article.py',
        'deploy/publish_rag_article.ps1',
        'docs/reviews/agent-rag-03-retrieval-design.md'
    )
    $staged = @(& git diff --cached --name-only)
    if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect staged files.' }
    if (@($staged | Where-Object { $_ -notin $files }).Count -gt 0) {
        throw 'Unrelated staged changes exist. Preserve them before publishing this article.'
    }
    & .\backend\.venv\Scripts\python.exe deploy/publish_rag_article.py --dry-run
    if ($LASTEXITCODE -ne 0) { throw 'Article validation failed.' }
    & git diff --check
    if ($LASTEXITCODE -ne 0) { throw 'Whitespace validation failed.' }
    & git add -- @files
    if ($LASTEXITCODE -ne 0) { throw 'Cannot stage article files.' }
    & git diff --cached --quiet
    $diffExit = $LASTEXITCODE
    if ($diffExit -eq 1) {
        & git commit -m 'Add reviewed RAG retrieval design article and safe publisher'
        if ($LASTEXITCODE -ne 0) { throw 'Commit failed.' }
    } elseif ($diffExit -ne 0) { throw 'Cannot inspect article changes.' }
    & git push origin main
    if ($LASTEXITCODE -ne 0) { throw 'GitHub push failed; the server was not updated.' }
    & ssh.exe admin@8.134.172.39 'cd /home/admin/personal-homepage && git pull --ff-only origin main && backend/.venv/bin/python deploy/publish_rag_article.py'
    if ($LASTEXITCODE -ne 0) { throw 'Server publication failed; inspect the preceding error.' }
    $baseUrl = 'http://8.134.172.39'
    $slug = 'agent-rag-03-retrieval-design'
    $expected = (Get-Content -LiteralPath backend/seed.json -Raw -Encoding utf8 | ConvertFrom-Json).posts | Where-Object { $_.slug -eq $slug }
    $actual = Invoke-RestMethod -Uri "$baseUrl/api/posts/$slug" -TimeoutSec 20
    if ($actual.title -ne $expected.title -or $actual.content -cne $expected.content -or $actual.is_example) {
        throw 'Public API content does not match the reviewed article.'
    }
    $page = Invoke-WebRequest -Uri "$baseUrl/blog/$slug" -TimeoutSec 20 -UseBasicParsing
    if ($page.StatusCode -ne 200) { throw 'Public article page did not return 200.' }
    Write-Host "Published and HTTP-verified: $baseUrl/blog/$slug"
} finally {
    Pop-Location
}
