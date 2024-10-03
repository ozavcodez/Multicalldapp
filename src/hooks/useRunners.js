import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";

const useRunners = () => {
    const [signer, setSigner] = useState();
    const { walletProvider } = useAppKitProvider("eip155");

    const provider = useMemo(
        // passing provider to ethers wrapper
        () => (walletProvider ? new BrowserProvider(walletProvider) : null), 
        [walletProvider]
    );

    useEffect(() => {
        // something extracted from the provider to sign a contract
        if (!provider) return;
        provider.getSigner().then((newSigner) => {
            // if (newSigner === signer) return;
            setSigner(newSigner);
        });
    }, [provider, signer]);
    // a wrapperaround the node , the wrapper provide all json rpc method
    return { provider, signer, readOnlyProvider: jsonRpcProvider };
};

export default useRunners;
