import { gql } from "@apollo/client";

export const getProjects = gql`
  query GetProjects {
    projects {
      id
      name
      description
      createdAt
    }
  }
`;

export const createProject = gql`mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    createdAt
    tasks {
      id
      title
    }
    }
  }
`;

export const updateProject = gql`mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    description
    createdAt
    tasks {
      id
      title
      status
    }
    }
  }
`;

export const deleteProject = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      name
      description
    }
  }
`;
