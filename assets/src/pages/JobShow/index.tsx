import { useParams } from 'react-router-dom'
import { useJob, useCandidates } from '../../hooks'
import { Text } from '@welcome-ui/text'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { useMemo } from 'react'
import { Candidate, updateCandidate } from '../../api'
import CandidateCard, { CARD_TYPE } from '../../components/Candidate'
import { Badge } from '@welcome-ui/badge'
import { useDrop } from "react-dnd";


type Statuses = 'new' | 'interview' | 'hired' | 'rejected'
const COLUMNS: Statuses[] = ['new', 'interview', 'hired', 'rejected']

interface SortedCandidates {
  new?: Candidate[]
  interview?: Candidate[]
  hired?: Candidate[]
  rejected?: Candidate[]
}

function JobShow() {
  const { jobId } = useParams();
  const { job } = useJob(jobId);
  const { candidates, refetch } = useCandidates(jobId);

  if (!jobId) {
    return <Text>Job ID not found</Text>;
  }

  const sortedCandidates = useMemo(() => {
    if (!candidates) return {};

    return candidates.reduce<SortedCandidates>((acc, c: Candidate) => {
      acc[c.status] = [...(acc[c.status] || []), c].sort((a, b) => a.position - b.position);
      return acc;
    }, {});
  }, [candidates]);

  const handleCardDrop = async (candidateId: number, newStatus: string) => {
    const newPosition = (sortedCandidates[newStatus]?.length || 0);
    try {
      await updateCandidate(jobId, candidateId, { status: newStatus, position: newPosition });
      refetch();
    } catch (error) {
      console.error("Failed to update candidate:", error);
    }
  };

  return (
    <>
      <Box backgroundColor="neutral-70" p={20} alignItems="center">
        <Text variant="h5" color="white" m={0}>
          {job?.name}
        </Text>
      </Box>

      <Box p={20}>
        <Flex gap={10}>
          {COLUMNS.map((column) => {
            const [, drop] = useDrop(() => ({
              accept: CARD_TYPE,
              drop: (item: { id: number }) => handleCardDrop(item.id, column),
            }));

            return (
              <Box
                ref={drop}
                key={column}
                w={300}
                border={1}
                backgroundColor="white"
                borderColor="neutral-30"
                borderRadius="md"
                overflow="hidden"
              >
                <Flex
                  p={10}
                  borderBottom={1}
                  borderColor="neutral-30"
                  alignItems="center"
                  justify="space-between"
                >
                  <Text color="black" m={0} textTransform="capitalize">
                    {column}
                  </Text>
                  <Badge>{(sortedCandidates[column] || []).length}</Badge>
                </Flex>
                <Flex direction="column" p={10} pb={0}>
                  {sortedCandidates[column]?.map((candidate: Candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </>
  );
}

export default JobShow;
