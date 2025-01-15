defmodule Wttj.Candidates do
  @moduledoc """
  The Candidates context.
  """

  import Ecto.Query, warn: false
  alias Wttj.Repo

  alias Wttj.Candidates.Candidate

  @doc """
  Returns the list of candidates.

  ## Examples

      iex> list_candidates()
      [%Candidate{}, ...]

  """
  def list_candidates(job_id) do
    query = from c in Candidate, where: c.job_id == ^job_id
    Repo.all(query)
  end

  @doc """
  Gets a single candidate.

  Raises `Ecto.NoResultsError` if the Candidate does not exist.

  ## Examples

      iex> get_candidate!(123)
      %Candidate{}

      iex> get_candidate!(456)
      ** (Ecto.NoResultsError)

  """
  def get_candidate!(job_id, id), do: Repo.get_by!(Candidate, id: id, job_id: job_id)

  @doc """
  Creates a candidate.

  ## Examples

      iex> create_candidate(%{field: value})
      {:ok, %Candidate{}}

      iex> create_candidate(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_candidate(attrs \\ %{}) do
    %Candidate{}
    |> Candidate.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a candidate.

  ## Examples

      iex> update_candidate(candidate, %{field: new_value})
      {:ok, %Candidate{}}

      iex> update_candidate(candidate, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_candidate(%Candidate{} = candidate, attrs) do
    candidate
    |> Candidate.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking candidate changes.

  ## Examples

      iex> change_candidate(candidate)
      %Ecto.Changeset{data: %Candidate{}}

  """
  def change_candidate(%Candidate{} = candidate, attrs \\ %{}) do
    Candidate.changeset(candidate, attrs)
  end

  def update_candidate_with_reordering(candidate, %{status: new_status, position: new_position} = attrs) do
  Ecto.Multi.new()
  |> Ecto.Multi.run(:adjust_positions, fn _repo, _changes ->
    adjust_positions(candidate.job_id, candidate.status, new_status, new_position, candidate.position)
  end)
  |> Ecto.Multi.update(:update_candidate, Candidate.changeset(candidate, attrs))
  |> Repo.transaction()
end

defp adjust_positions(job_id, old_status, new_status, new_position, old_position) do
  if old_status == new_status do
    # Check if the new position already exists for the same job_id and status
    existing_position_query = 
      from(c in Candidate,
        where: c.job_id == ^job_id and c.status == ^new_status and c.position == ^new_position
      )

    case Repo.one(existing_position_query) do
      nil -> # No conflict, proceed with update
        query =
          from(c in Candidate,
            where: c.job_id == ^job_id and c.status == ^new_status and c.position >= ^new_position,
            update: [inc: [position: 1]]
          )

        Repo.update_all(query, [])

      _existing_candidate -> # There is already a candidate with the same position
        # You could handle the conflict here, for example, by raising an error, or adjusting the position further.
        {:error, :position_conflict}
    end
  else
    # If statuses are different, handle the case accordingly
    Repo.transaction(fn ->
      # Decrement positions in the old status group
      Repo.update_all(
        from(c in Candidate,
          where: c.job_id == ^job_id and c.status == ^old_status and c.position > ^old_position,
          update: [inc: [position: -1]]
        ),
        []
      )

      # Increment positions in the new status group
      Repo.update_all(
        from(c in Candidate,
          where: c.job_id == ^job_id and c.status == ^new_status and c.position >= ^new_position,
          update: [inc: [position: 1]]
        ),
        []
      )
    end)
  end
end


end
