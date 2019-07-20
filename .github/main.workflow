workflow "Deploy Site" {
  on = "push"
  resolves = ["Build and Deploy Jekyll"]
}

action "Build and Deploy Jekyll" {
  uses = "wallies/jekyll-deploy-gh-pages@master"
  secrets = ["GITHUB_TOKEN"]
}
