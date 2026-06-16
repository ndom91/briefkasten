{
  # Example from: https://johns.codes/blog/building-typescript-node-apps-with-nix
  description = "Sample Nix ts-node build";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dream2nix.url = "github:nix-community/dream2nix";
  };
  outputs = { self, nixpkgs, flake-utils, gitignore, dream2nix, ... }:
    let
      dream2nixOutputs = dream2nix.lib.makeFlakeOutputs {
        systems = flake-utils.lib.defaultSystems;
        config.projectRoot = ./.;
        source = gitignore.lib.gitignoreSource ./.;
      };
      customOutput = flake-utils.lib.eachDefaultSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
          # the dream2nix output for this system
          app = dream2nixOutputs.packages."${system}".example-node-nix;
        in
        with pkgs; {
          packages.docker = dockerTools.buildImage {
            name = app.packageName;
            copyToRoot = pkgs.buildEnv {
              name = app.packageName;
              paths = [ app ];
              pathsToLink = [ "/bin" "/lib" ];
            };
            # This ensures symlinks to directories are preserved in the image
            keepContentsDirlinks = true;
            config = { Cmd = [ "/bin/ts-node-nix" ]; };
          };
        });
      # deep merge outputs together
    in
    nixpkgs.lib.recursiveUpdate dream2nixOutputs customOutput;
}

