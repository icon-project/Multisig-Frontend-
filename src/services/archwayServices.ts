import { executeArchwayContractCall } from '../utils/archwayUtils';

export const archwayExecuteMemberManagement = async (
  chainId: string,
  contractAddress: string,
  multiSigMemberContract: string,
  proposalTitle: string,
  proposalDescription: string,
  thresholdValue: number,
  membersAdd: string[] = [],
  membersRemove: string[] = [],
) => {
  const updateMembersTxMsg = {
    update_members: {
      remove: membersRemove,
      add: membersAdd,
    },
  };

  const updateThresholdTxMsg = {
    update_threshold: {
      threshold: thresholdValue,
    },
  };

  const updateMembersTxMsgb64 = btoa(JSON.stringify(updateMembersTxMsg));
  const updateThresholdTxMsgb64 = btoa(JSON.stringify(updateThresholdTxMsg));

  const txMsg = [
    {
      wasm: {
        execute: {
          contract_addr: multiSigMemberContract,
          msg: updateMembersTxMsgb64,
          funds: [],
        },
      },
    },
    {
      wasm: {
        execute: {
          contract_addr: contractAddress,
          msg: updateThresholdTxMsgb64,
          funds: [],
        },
      },
    },
  ];

  const proposeMsg = {
    propose: {
      title: proposalTitle,
      description: proposalDescription,
      msgs: txMsg,
      latest: null,
    },
  };

  try {
    const res = await executeArchwayContractCall(chainId, contractAddress, proposeMsg);
    if (res) {
      return res;
    }
  } catch (err) {
    throw err;
  }
};

export const archwayExecuteContractUpgrade = async (
  chainId: string,
  contractAddress: string,
  proposalTitle: string,
  proposalDescription: string,
  upgradingContractAddress: string,
  newCodeId: number,
) => {
  const migrateTxMsg = {};
  const migrateTxMsgb64 = btoa(JSON.stringify(migrateTxMsg));

  const txMsg = [
    {
      wasm: {
        migrate: {
          contract_addr: upgradingContractAddress,
          msg: migrateTxMsgb64,
          new_code_id: newCodeId,
        },
      },
    },
  ];

  const proposeMsg = {
    propose: {
      title: proposalTitle,
      description: proposalDescription,
      msgs: txMsg,
      latest: null,
    },
  };

  try {
    const res = await executeArchwayContractCall(chainId, contractAddress, proposeMsg);
    if (res) {
      return res;
    }
  } catch (err) {
    throw err;
  }
};
