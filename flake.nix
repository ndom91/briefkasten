{
  inputs.pkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.prisma-utils.url = "github:VanCoding/nix-prisma-utils";

  outputs =
    { pkgs, prisma-utils, ... }:
    let
      nixpkgs = import pkgs { system = "x86_64-linux"; };
      prisma =
        (prisma-utils.lib.prisma-factory {
          inherit nixpkgs;
          prisma-fmt-hash = "sha256-dqKh4BRuOjPk8oHn3pKwP63zSs4I10SYIu1/raC8y5g=";
          query-engine-hash = "sha256-PBuVZ6Cw7rIwB89RMC6iY3ZyBuo/BcQgM2wsX5ggzWg=";
          libquery-engine-hash = "sha256-d+XWz9BbDSz/ZbycF64bA+bvm5pnaF7l5le/KTfRwUQ=";
          schema-engine-hash = "sha256-coTYlofR4KTlbrygv9/NNUlnDp3tuCBUXb66LPAcKF8=";
        }).fromPnpmLock
          ./pnpm-lock.yaml;
    in
    {
      devShells.x86_64-linux.default = nixpkgs.mkShell { shellHook = prisma.shellHook; };
    };
}

