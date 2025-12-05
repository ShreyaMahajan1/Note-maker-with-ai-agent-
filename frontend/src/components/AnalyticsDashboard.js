import React, { useState } from 'react';

const AnalyticsDashboard = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (!data || !data.labels || !data.values) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
        <p>No analytics data available yet.</p>
      </div>
    );
  }

  const colors = ['#615af1', '#8b7ef5', '#a78bfa', '#c4b5fd', '#7c3aed', '#9333ea'];
  const total = data.values.reduce((sum, val) => sum + val, 0);
  const maxValue = Math.max(...data.values);
  const avgNotesPerCategory = total > 0 ? (total / data.labels.length).toFixed(1) : 0;
  const topCategory = data.labels[data.values.indexOf(maxValue)];

  // Y-axis calculation
  const yAxisSteps = 5;
  const stepValue = Math.ceil(maxValue / yAxisSteps);
  const yAxisMax = stepValue * yAxisSteps || 10;
  const yAxisLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => yAxisMax - (i * stepValue));

  // Calculate growth (mock data)
  const growth = 13;
  const isPositive = growth > 0;

  const TrendingUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );

  const TrendingDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0f172a',
      padding: isMobile ? '16px' : '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : '280px 1fr',
        gap: isMobile ? '16px' : '24px',
        height: '100%',
        maxWidth: isMobile ? undefined : '1600px',
        margin: '0 auto',
        overflowX: isMobile ? 'auto' : 'visible'
      }}>
        {/* Left Column - Stats Cards */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          flexWrap: 'nowrap',
          gap: isMobile ? '12px' : '20px',
          height: '100%',
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? '8px' : '0'
        }}>
          {/* Total Notes Card */}
          <div style={{
            width: isMobile ? '220px' : '100%',
            minWidth: isMobile ? '220px' : 'auto',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px',
            flex: isMobile ? '0 0 auto' : 1
          }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
              Total Notes
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px 0' }}>
              {total}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              <span style={{ fontSize: '0.75rem', color: isPositive ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {Math.abs(growth)}%
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                vs last week
              </span>
            </div>
          </div>

          {/* Categories Card */}
          <div style={{
            width: isMobile ? '220px' : '100%',
            minWidth: isMobile ? '220px' : 'auto',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px',
            flex: isMobile ? '0 0 auto' : 1
          }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
              Categories
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px 0' }}>
              {data.labels.length}
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
              Active categories
            </p>
          </div>

          {/* Average Card */}
          <div style={{
            width: isMobile ? '220px' : '100%',
            minWidth: isMobile ? '220px' : 'auto',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px',
            flex: isMobile ? '0 0 auto' : 1
          }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
              Average
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px 0' }}>
              {avgNotesPerCategory}
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
              Notes per category
            </p>
          </div>

          {/* Top Category Card */}
          <div style={{
            width: isMobile ? '220px' : '100%',
            minWidth: isMobile ? '220px' : 'auto',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px',
            flex: isMobile ? '0 0 auto' : 1
          }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
              Top Category
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px 0' }}>
              {maxValue}
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
              {topCategory}
            </p>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px', height: '100%' }}>
          {/* Top Row - Two Bar Charts */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '20px', 
            height: isMobile ? 'auto' : '45%'
          }}>
            {/* Notes Distribution */}
            <div style={{
              padding: isMobile ? '16px' : '20px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '8px',
              flex: isMobile ? 1 : 1.5,
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '250px' : 'auto',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px 0' }}>
                Notes Distribution
              </h3>
              
              <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                {/* Y-Axis */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '180px',
                  paddingTop: '4px',
                  paddingBottom: '24px'
                }}>
                  {yAxisLabels.map((label, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'right',
                        minWidth: '20px',
                        fontFamily: 'monospace'
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Chart Area */}
                <div style={{ flex: 1, position: 'relative' }}>
                  {/* Grid Lines */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: isMobile ? '160px' : '100%',
                    paddingTop: '4px',
                    paddingBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    pointerEvents: 'none'
                  }}>
                    {yAxisLabels.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '100%',
                          height: '1px',
                          background: index === yAxisLabels.length - 1
                            ? 'rgba(139, 92, 246, 0.2)'
                            : 'rgba(139, 92, 246, 0.05)'
                        }}
                      />
                    ))}
                  </div>

                  {/* Bars */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    gap: '4px',
                    height: isMobile ? '160px' : '100%',
                    paddingTop: '4px',
                    paddingBottom: '24px',
                    position: 'relative'
                  }}>
                    {data.labels.map((label, index) => {
                      const value = data.values[index];
                      const barHeight = yAxisMax > 0 ? (value / yAxisMax) * 100 : 0;
                      const isHovered = hoveredBar === index;

                      return (
                        <div
                          key={label}
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1,
                            height: '100%',
                            justifyContent: 'flex-end',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: isHovered ? '#f1f5f9' : colors[index % colors.length],
                            marginBottom: '4px',
                            transition: 'all 0.2s ease'
                          }}>
                            {value}
                          </span>

                          <div style={{
                            width: '100%',
                            maxWidth: '36px',
                            height: `${barHeight}%`,
                            minHeight: value > 0 ? '6px' : 0,
                            background: colors[index % colors.length],
                            borderRadius: '4px 4px 0 0',
                            transition: 'all 0.3s ease',
                            transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)'
                          }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-Axis Labels */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    gap: '4px',
                    marginTop: '-6px',
                  }}>
                    {data.labels.map((label) => (
                      <span
                        key={label}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: '#64748b',
                          textAlign: 'center',
                          flex: 1,
                          maxWidth: '36px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={{
              padding: isMobile ? '16px' : '20px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '8px',
              flex: isMobile ? 1 : 4,
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '250px' : 'auto',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px 0' }}>
                Category Breakdown
              </h3>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {data.labels.map((label, index) => {
                  const value = data.values[index];
                  const percentage = total > 0 ? (value / total) * 100 : 0;

                  return (
                    <div key={label} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>
                          {label}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors[index % colors.length] }}>
                          {value}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: colors[index % colors.length],
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Row - Area Chart */}
          <div style={{
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px',
            height: isMobile ? '240px' : '55%',
            minHeight: isMobile ? '220px' : 'auto'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px 0' }}>
              Notes Over Time (Last 7 Days)
            </h3>
            
            <div style={{ position: 'relative', height: isMobile ? '150px' : 'calc(100% - 40px)', minHeight: '140px' }}>
              <svg width="100%" height="100%" viewBox="0 0 700 160" preserveAspectRatio="none" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#615af1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#615af1" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                <path
                  d="M 0 100 Q 50 80, 100 85 T 200 75 T 300 80 T 400 70 T 500 75 T 600 65 T 700 70 L 700 160 L 0 160 Z"
                  fill="url(#areaGradient)"
                />
                
                <path
                  d="M 0 100 Q 50 80, 100 85 T 200 75 T 300 80 T 400 70 T 500 75 T 600 65 T 700 70"
                  fill="none"
                  stroke="#615af1"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '0 4px' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;