import { useReadContract } from "wagmi";
import { GUARDIAN_REGISTRY_ADDRESS } from "../constants/contracts";
import guardianRegistryAbi from "../abis/GuardianRegistry.json";

export function useProtectedContracts() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: GUARDIAN_REGISTRY_ADDRESS as `0x${string}`,
    abi: guardianRegistryAbi,
    functionName: "getAllProtectedContracts",
  });

  return {
    contracts: (data as string[]) || [],
    isLoading,
    error,
    refetch,
  };
}

export function useContractDetails(contractAddress: string) {
  const { data, isLoading, error } = useReadContract({
    address: GUARDIAN_REGISTRY_ADDRESS as `0x${string}`,
    abi: guardianRegistryAbi,
    functionName: "getContractDetails",
    args: [contractAddress],
  });

  return {
    contract: data,
    isLoading,
    error,
  };
}

export function useIsContractPaused(contractAddress: string) {
  const { data, isLoading } = useReadContract({
    address: GUARDIAN_REGISTRY_ADDRESS as `0x${string}`,
    abi: guardianRegistryAbi,
    functionName: "isContractPaused",
    args: [contractAddress],
  });

  return {
    isPaused: data as boolean,
    isLoading,
  };
}
