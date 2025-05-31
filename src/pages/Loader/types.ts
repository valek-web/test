export interface FileInfo {
  name: string
  type: string
  mtime: string
  size: number
}

export interface FileItem extends FileInfo {
  url: string
  progress: number
  completed: boolean
  speed?: string
  remainingTime?: string
}
