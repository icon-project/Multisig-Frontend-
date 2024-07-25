export const ProposalStatus = {
  open: "open",
  passed: "passed",
  executed: "executed",
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  msgs: Array<{
    wasm: {
      execute: {
        contract_addr: string;
        msg: string;
        funds: Array<any>;
      };
    };
  }>;
  status: string;
  expires: {
    at_time: string;
  };
  threshold: {
    absolute_count: {
      weight: number;
      total_weight: number;
    };
  };
  proposer: string;
  deposit: any | null;
};
