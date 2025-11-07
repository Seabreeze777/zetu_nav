/**
 * ToggleSwitch组件单元测试
 */

import { render, screen, fireEvent } from '@testing-library/react'
import ToggleSwitch from '../common/ToggleSwitch'

describe('ToggleSwitch Component', () => {
  it('应该正确渲染', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('应该显示正确的选中状态', () => {
    const { rerender } = render(<ToggleSwitch checked={false} onChange={() => {}} />)
    
    let switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
    
    // 重新渲染为选中状态
    rerender(<ToggleSwitch checked={true} onChange={() => {}} />)
    switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('点击时应该触发onChange回调', () => {
    const handleChange = jest.fn()
    render(<ToggleSwitch checked={false} onChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('禁用状态时不应该触发onChange', () => {
    const handleChange = jest.fn()
    render(<ToggleSwitch checked={false} onChange={handleChange} disabled={true} />)
    
    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)
    
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('应该正确显示标签', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="启用状态" />)
    
    expect(screen.getByText('启用状态')).toBeInTheDocument()
  })
})

