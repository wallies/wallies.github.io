workflow "Deploy Site" {
  resolves = ["Build and Deploy Jekyll"]
  on = "push"
}

action "Build and Deploy Jekyll" {
  uses = "wallies/wallies.github.io@master"
  secrets = ["GITHUB_TOKEN"]
}
