/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_fpl.json`.
 */
export type SolanaFpl = {
  address: "2dnqbQJG4EWB6XyfrvVyTB9LiAM7QgTSUqFCcEJfuYk8";
  metadata: {
    name: "solanaFpl";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "bet";
      discriminator: [94, 203, 166, 126, 20, 243, 169, 82];
      accounts: [
        {
          name: "escrowAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              }
            ];
          };
        },
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "userTokenAccount";
          writable: true;
        },
        {
          name: "escrowTokenAccount";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "claimWinner";
      discriminator: [57, 91, 116, 208, 202, 66, 82, 139];
      accounts: [
        {
          name: "escrowAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              }
            ];
          };
        },
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "userTokenAccount";
          writable: true;
        },
        {
          name: "escrowTokenAccount";
          writable: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "initializeEscrow";
      discriminator: [243, 160, 77, 153, 11, 92, 48, 209];
      accounts: [
        {
          name: "escrowAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              }
            ];
          };
        },
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "usdcMint";
          type: "pubkey";
        },
        {
          name: "totalPotForWinners";
          type: "u64";
        },
        {
          name: "betAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "setEligibility";
      discriminator: [101, 95, 132, 213, 175, 252, 123, 46];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["escrowAccount"];
        },
        {
          name: "escrowAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              }
            ];
          };
        },
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "payoutAmount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "escrowAccount";
      discriminator: [36, 69, 48, 18, 128, 225, 125, 135];
    },
    {
      name: "userAccount";
      discriminator: [211, 33, 136, 16, 186, 110, 242, 127];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidAmount";
      msg: "Invalid amount provided.";
    },
    {
      code: 6001;
      name: "insufficientFunds";
      msg: "Insufficient funds in the user's token account.";
    },
    {
      code: 6002;
      name: "unauthorized";
      msg: "Unauthorized to perform this action";
    },
    {
      code: 6003;
      name: "overflow";
      msg: "Overflow while adding bet amount to escrow balance";
    },
    {
      code: 6004;
      name: "underflow";
      msg: "Underflow while passing payout from escrow to user";
    },
    {
      code: 6005;
      name: "tokenTransferFailed";
      msg: "Token transfer failed";
    },
    {
      code: 6006;
      name: "notEligible";
      msg: "User is not eligible to claim";
    }
  ];
  types: [
    {
      name: "escrowAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "usdcMint";
            type: "pubkey";
          },
          {
            name: "totalPotForWinners";
            type: "u64";
          },
          {
            name: "betAmount";
            type: "u64";
          },
          {
            name: "usdcBalance";
            type: "u128";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "userAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "isEligible";
            type: "bool";
          },
          {
            name: "payoutAmount";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};
