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
          prisma-fmt-hash = "sha256-v0EWddy7VVuxCK9BB8LqnBhIcZet+kVhuvzlKIS+qfs=";
          query-engine-hash = "sha256-PBuVZ6Cw7rIwB89RMC6iY3ZyBuo/BcQgM2wsX5ggzWg=";
          libquery-engine-hash = "sha256-o/16nzI8emeM1EvCdqtL53CJ7yEyJjWusKovGXMllo4=";
          schema-engine-hash = "sha256-coTYlofR4KTlbrygv9/NNUlnDp3tuCBUXb66LPAcKF8=";
        }).fromPnpmLock
          ./pnpm-lock.yaml;
    in
    {
      devShells.x86_64-linux.default = nixpkgs.mkShell { shellHook = prisma.shellHook; };
    };
}

