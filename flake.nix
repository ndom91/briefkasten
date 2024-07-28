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
          prisma-fmt-hash = "sha256-5r8j2x5/5FauFn9HRKcd+tkHVyfObQ9lWCpb7l/oeT8=";
          query-engine-hash = "sha256-m8hX3r4NV2DFce5icQdiI9lL6YHCmiJAHeaB8/cOBn0=";
          libquery-engine-hash = "sha256-El11c5vX/NuOq7VCg1W1vgD1QAQ+a8H1swJolHr6sb0=";
          schema-engine-hash = "sha256-mK1DP9ZNouoettVlVTqaQzns8w8cIRsotpaQ9ZEmmkE=";
        }).fromPnpmLock
          ./pnpm-lock.yaml;
    in
    {
      devShells.x86_64-linux.default = nixpkgs.mkShell { shellHook = prisma.shellHook; };
    };
}

