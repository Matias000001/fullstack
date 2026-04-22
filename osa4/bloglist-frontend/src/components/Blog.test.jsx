import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Test Blog Title', { exact: false })).toBeDefined()
  expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
  expect(screen.getByText('http://testurl.com')).not.toBeVisible()
  expect(screen.getByText('likes 5', { exact: false })).not.toBeVisible()
})
