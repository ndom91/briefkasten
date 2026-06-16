{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { nixpkgs, ... }:
    let
      genSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" ];
      pkgsFor = nixpkgs.legacyPackages;
    in
    {
      devShells = genSystems (system: {
        default = pkgsFor.${system}.mkShell {
          programs.bash.sessionVariables.PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
          programs.bash.sessionVariables.PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
          programs.bash.sessionVariables.PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
          programs.bash.sessionVariables.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = "1";

          packages = with pkgsFor.${system}; [
            nodejs_20
            nodePackages.pnpm
            bun
            openssl
            vips # for sharp
            pkg-config
            prisma-engines
            stdenv.cc.cc
          ];
        };
      });
    };
}
