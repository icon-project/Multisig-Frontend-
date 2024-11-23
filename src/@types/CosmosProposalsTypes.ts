export const ProposalStatus = {
  open: 'open',
  passed: 'passed',
  executed: 'executed',
};

export interface WasmExecuteMsg {
  execute: {
    contract_addr: string;
    msg: string;
    funds: any[];
  };
}

export interface WasmMigrateMsg {
  migrate: {
    contract_addr: string;
    new_code_id: number;
    msg: string;
  };
}

type WasmMsg = WasmExecuteMsg | WasmMigrateMsg;

interface Msg {
  wasm: WasmMsg;
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  msgs: Msg[];
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
}
