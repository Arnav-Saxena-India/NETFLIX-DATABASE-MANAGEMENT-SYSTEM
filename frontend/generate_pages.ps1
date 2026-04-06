$pages = @("Dashboard", "Users", "Shows", "Subscriptions", "Payments", "WatchHistory", "Reviews", "Reports", "Recommendations")

foreach ($page in $pages) {
    if (-not (Test-Path "src/pages")) {
        New-Item -ItemType Directory -Force -Path "src/pages" | Out-Null
    }
    
    $content = @"
export default function $page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">$page</h1>
        <p className="text-[#a3aac4] mt-1 space-y-1">
          Manage $page operations and configurations.
        </p>
      </div>
      <div className="glass-panel p-6">
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-lg">
          <p className="text-[#a3aac4] flex flex-col items-center gap-2">
            <span>$page module coming soon.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
"@
    Set-Content -Path "src/pages/$page.jsx" -Value $content
}
