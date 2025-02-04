import { useCallback } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { parseEther } from "ethers";

const useVoteProposal = () => {
    const contract = useContract(true);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    return useCallback(
        async (proposalId) => {
            // if (
            //     !description ||
            //     !recipient ||
            //     !amount ||
            //     !duration ||
            //     !minVote
            // ) {
            //     toast.error("Missing field(s)");
            //     return;
            // }
            if (!address) {
                toast.error("Connect your wallet!");
                return;
            }
            if (Number(chainId) !== liskSepoliaNetwork.chainId) {
                toast.error("You are not connected to the right network");
                return;
            }

            if (!contract) {
                toast.error("Cannot get contract!");
                return;
            }

            try {
                const estimatedGas = await contract.vote.estimateGas(
                    proposalId
                );
                const tx = await contract.vote(
                   proposalId,
                    {
                        gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
                    }
                );
                const reciept = await tx.wait();

                if (reciept.status === 1) {
                    toast.success("vote successful");
                    return;
                }
                toast.error("Vote failed");
                return;
            } catch (error) {
                console.error("error while creating proposal: ", error);
                toast.error("Vote Creation errored");
            }
        },
        [address, chainId, contract]
    );
};

export default useVoteProposal;
