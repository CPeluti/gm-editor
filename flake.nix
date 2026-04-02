{
  description = "Node.js development environment";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux"; # Change to "aarch64-darwin" for Apple Silicon
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_20   # Specify version (e.g., nodejs_18, nodejs_22)
          pnpm
        ];
        shellHook = ''
          echo "Node.js $(node --version) development environment loaded!"
        '';
      };
    };
}
