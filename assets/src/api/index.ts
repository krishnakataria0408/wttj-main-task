export * from './index.ts'; // Include all functions, including `updateCandidate`


type Job = {
  id: string
  name: string
}

export type Candidate = {
  id: number
  email: string
  status: 'new' | 'interview' | 'hired' | 'rejected'
  position: number
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await fetch(`http://localhost:4000/api/jobs`)
  const { data } = await response.json()
  return data
}

export const getJob = async (jobId?: string): Promise<Job | null> => {
  if (!jobId) return null
  const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`)
  const { data } = await response.json()
  return data
}

export const getCandidates = async (jobId?: string): Promise<Candidate[]> => {
  if (!jobId) return []
  const response = await fetch(`http://localhost:4000/api/jobs/${jobId}/candidates`)
  const { data } = await response.json()
  return data
}

export interface UpdateCandidatePayload {
  status: string;
  position: number;
}

export async function updateCandidate(
  jobId: string,
  candidateId: string,
  candidateData: Partial<Candidate>
) {
  const response = await fetch(`/api/jobs/${jobId}/candidates/${candidateId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ candidate: candidateData }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update candidate with id ${candidateId}`)
  }

  return response.json()
}

