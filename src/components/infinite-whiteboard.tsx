
"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MessageSquare, FilePlus2, X, Plus, Minus, UploadCloud, FileText, Bot as BotIcon, Link2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';
import ChatInterface from '@/components/chatbot/chat-interface';
import { Button } from '@/components/ui/button';
import { useDropzone, type Accept } from 'react-dropzone';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

const CHATBOT_PANEL_WIDTH = 400;
const CHATBOT_PANEL_HEIGHT = 500;
const FILE_CARD_PANEL_WIDTH = 450;
const FILE_CARD_PANEL_HEIGHT = 450; // Adjusted to be a fixed height for consistency
const ANALYSIS_PANEL_WIDTH = 350;
const ANALYSIS_PANEL_HEIGHT = 250;
const PANEL_SPACING = 30;

const BASE_PANEL_Z_INDEX = 20;
const CONTEXT_MENU_Z_INDEX = 100;
const ZOOM_CONTROLS_Z_INDEX = 110;
const SVG_LINES_Z_INDEX = 5;


const acceptedFileTypes: Accept = {
  'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/csv': ['.csv'],
  'text/plain': ['.txt'],
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface PanelState {
  id: string;
  type: 'chatbot' | 'fileCard' | 'analysisResult';
  x: number;
  y: number;
  zIndex: number;
  width: number;
  height: number;
  content?: string;
  sourcePanelId?: string;
  initialChatMessages?: Message[];
}

interface FileCardPanelContentProps {
  panelId: string;
  panelX: number;
  panelY: number;
  panelWidth: number;
  panelHeight: number;
  onClose: (panelId: string) => void;
  onInitiateChat: (files: File[], panelX: number, panelY: number, panelWidth: number, panelHeight: number) => void;
  onGetInsights: (files: File[], panelX: number, panelY: number, panelWidth: number, panelHeight: number, sourcePanelId: string) => void;
}

const FileCardPanelContent: React.FC<FileCardPanelContentProps> = (props) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDropFile = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles].slice(0, 10)); // Limit to 10 files
  }, []);

  const {
    getRootProps: getFileRootProps,
    getInputProps: getFileInputProps,
    isDragActive: isFileDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop: onDropFile,
    noClick: true,
    noKeyboard: true,
    accept: acceptedFileTypes,
  });

  const removeFile = (fileName: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const handleInitiateChatClick = () => {
    if (uploadedFiles.length > 0) {
      props.onInitiateChat(uploadedFiles, props.panelX, props.panelY, props.panelWidth, props.panelHeight);
    }
  };

  const handleGetInsightsClick = () => {
     if (uploadedFiles.length > 0) {
      props.onGetInsights(uploadedFiles, props.panelX, props.panelY, props.panelWidth, props.panelHeight, props.panelId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div {...getFileRootProps({ onClick: e => e.stopPropagation() })} className="flex-grow p-4 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 m-4 rounded-md hover:border-primary transition-colors">
        <input {...getFileInputProps()} />
        {isFileDragActive ? (
          <>
            <UploadCloud className="h-12 w-12 text-primary mb-2" />
            <p className="text-lg font-medium text-primary">Drop files here...</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-12 w-12 text-muted-foreground/70 mb-2" />
            <p className="text-center text-sm text-muted-foreground">Drag 'n' drop files here, or click button.</p>
            <Button type="button" onClick={(e) => { e.stopPropagation(); openFileDialog(); }} variant="outline" size="sm" className="mt-3" data-cursor-interactive="true">
              Select Files
            </Button>
          </>
        )}
      </div>
      {uploadedFiles.length > 0 && (
        <div className="p-4 border-t flex-shrink-0 max-h-48 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2 text-card-foreground">Selected files:</h4>
          <ul className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 p-1.5 rounded-sm">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate" title={file.name}>{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="p-0.5 rounded-full hover:bg-destructive/20 text-destructive"
                  aria-label={`Remove ${file.name}`}
                  data-cursor-interactive="true"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="p-3 border-t bg-muted/30 flex-shrink-0 flex justify-end space-x-2">
        <Button
          onClick={handleInitiateChatClick}
          disabled={uploadedFiles.length === 0}
          size="sm"
          variant="outline"
          data-cursor-interactive="true"
        >
          Chat about Files <Link2 className="ml-2 h-4 w-4" />
        </Button>
        <Button
          onClick={handleGetInsightsClick}
          disabled={uploadedFiles.length === 0}
          size="sm"
          data-cursor-interactive="true"
        >
          Get Insights <Lightbulb className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface AnalysisResultPanelContentProps {
  content: string;
}
const AnalysisResultPanelContent: React.FC<AnalysisResultPanelContentProps> = ({ content }) => {
  return (
    <div className="p-4 text-sm text-card-foreground overflow-y-auto h-full">
      {content.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
    </div>
  );
};

export default function InfiniteWhiteboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // Canvas coordinates

  const [panels, setPanels] = useState<PanelState[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [draggingPanel, setDraggingPanel] = useState<{
    id: string;
    initialMouseX: number;
    initialMouseY: number;
    initialPanelX: number;
    initialPanelY: number;
  } | null>(null);

  const [activeZCounter, setActiveZCounter] = useState(BASE_PANEL_Z_INDEX + panels.length + 1);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const timeoutId = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = (containerRef.current.scrollWidth - containerRef.current.clientWidth) / 2;
          containerRef.current.scrollTop = (containerRef.current.scrollHeight - containerRef.current.clientHeight) / 2;
        }
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // e.stopPropagation(); // Reverted
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const xOnCanvas = e.clientX - containerRect.left + containerRef.current.scrollLeft;
      const yOnCanvas = e.clientY - containerRect.top + containerRef.current.scrollTop;
      
      setMenuPosition({ x: xOnCanvas, y: yOnCanvas });
      setMenuVisible(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuVisible && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible]);


  const handleZoomIn = useCallback(() => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        // Reverted to simple zoom without mouse point anchoring
        if (event.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoomLevel, handleZoomIn, handleZoomOut]);

  const addPanel = (type: 'chatbot' | 'fileCard') => {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    let newActiveZ = activeZCounter + 1;
    setActiveZCounter(newActiveZ);

    let panelWidth, panelHeight;
    if (type === 'chatbot') {
      panelWidth = CHATBOT_PANEL_WIDTH;
      panelHeight = CHATBOT_PANEL_HEIGHT;
    } else { // fileCard
      panelWidth = FILE_CARD_PANEL_WIDTH;
      panelHeight = FILE_CARD_PANEL_HEIGHT;
    }
    
    const newPanel: PanelState = {
      id: newId,
      type,
      x: menuPosition.x, 
      y: menuPosition.y,
      zIndex: newActiveZ,
      width: panelWidth,
      height: panelHeight,
    };
    setPanels(prevPanels => [...prevPanels, newPanel]);
    setMenuVisible(false);
  };

  const removePanel = (panelIdToRemove: string) => {
    setPanels(prevPanels => {
        const panelToRemove = prevPanels.find(p => p.id === panelIdToRemove);
        if (panelToRemove) {
             // Also remove any analysisResult panels linked to this fileCard if it's a fileCard
            if (panelToRemove.type === 'fileCard') {
                 return prevPanels.filter(p => p.id !== panelIdToRemove && p.sourcePanelId !== panelIdToRemove);
            }
             // Or just remove the panel itself if it's a chatbot or an analysisResult
            return prevPanels.filter(p => p.id !== panelIdToRemove);
        }
        return prevPanels;
    });
  };
  
  const handleInitiateChatWithFiles = useCallback((
    files: File[],
    sourcePanelX: number,
    sourcePanelY: number,
    sourcePanelWidth: number,
    sourcePanelHeight: number
  ) => {
    const newId = `chatbot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let newActiveZ = activeZCounter + 1;
    setActiveZCounter(newActiveZ);

    const fileNames = files.map(f => f.name).join(', ');
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: `Let's discuss these files: ${fileNames}. What would you like to know or do with them?`,
      sender: 'ai' as const,
    };

    const newChatPanel: PanelState = {
      id: newId,
      type: 'chatbot',
      x: sourcePanelX, 
      y: sourcePanelY + sourcePanelHeight + PANEL_SPACING,
      zIndex: newActiveZ,
      width: CHATBOT_PANEL_WIDTH,
      height: CHATBOT_PANEL_HEIGHT,
      initialChatMessages: [initialMessage],
    };
    setPanels(prev => [...prev, newChatPanel]);
  }, [activeZCounter]);

  const handleRequestAnalysis = useCallback((
    files: File[],
    sourcePanelX: number,
    sourcePanelY: number,
    sourcePanelWidth: number,
    sourcePanelHeight: number,
    sourcePanelId: string
  ) => {
    if (files.length === 0) return;

    const existingAnalysisPanels = panels.filter(
      (p) => p.type === 'analysisResult' && p.sourcePanelId === sourcePanelId
    );

    if (existingAnalysisPanels.length === 3) {
      console.log("Full set of insights already displayed for this source. No new panels created.");
      return; // Do nothing if 3 insights already exist for this source
    }
    
    // Clear previous insights for this source if not a full set (or if some were closed)
    let nextPanelsState = panels.filter(p => !(p.type === 'analysisResult' && p.sourcePanelId === sourcePanelId));
    
    let newBaseZ = activeZCounter + 1; // Prepare new base zIndex
    
    const fileNames = files.map(f => f.name).join(', ');
    const firstFile = files[0];

    const newAnalysisPanels: PanelState[] = Array.from({ length: 3 }).map((_, i) => {
      const newId = `analysis-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`;
      let insightContent = "";
      if (i === 0) {
          insightContent = `Insight 1 from ${fileNames}:\nFile Overview: ${firstFile ? `${firstFile.name} (${(firstFile.size / 1024).toFixed(2)}KB, type: ${firstFile.type})` : 'No file details'}.\nThe AI would perform initial file type identification and structural assessment.`;
      } else if (i === 1) {
          insightContent = `Insight 2 from ${fileNames}:\nSimulated Data Structure.\nThe AI would attempt to determine headers (e.g., 'ID', 'Value', 'Timestamp') and infer data types for columns/fields.`;
      } else {
          insightContent = `Insight 3 from ${fileNames}:\nExample Key Finding.\nA potential insight could be related to data distribution, outliers, or a summary statistic like 'Average value is X' or 'Most common category is Y'.`;
      }
      return {
        id: newId,
        type: 'analysisResult',
        x: sourcePanelX,
        y: sourcePanelY + sourcePanelHeight + PANEL_SPACING + (i * (ANALYSIS_PANEL_HEIGHT + PANEL_SPACING)),
        zIndex: newBaseZ + i,
        width: ANALYSIS_PANEL_WIDTH,
        height: ANALYSIS_PANEL_HEIGHT,
        content: insightContent,
        sourcePanelId: sourcePanelId,
      };
    });
    setPanels([...nextPanelsState, ...newAnalysisPanels]);
    setActiveZCounter(newBaseZ + 2); // Update activeZCounter after adding new panels
  }, [panels, activeZCounter]);


  const handlePanelMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    panelId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.add('cursor-grabbing');

    const panelToDrag = panels.find(p => p.id === panelId);
    if (!panelToDrag) return;

    let newActiveZ = activeZCounter + 1;
    setActiveZCounter(newActiveZ);

    setPanels(prev => prev.map(p => p.id === panelId ? { ...p, zIndex: newActiveZ } : p));

    setDraggingPanel({
      id: panelId,
      initialMouseX: e.clientX,
      initialMouseY: e.clientY,
      initialPanelX: panelToDrag.x,
      initialPanelY: panelToDrag.y,
    });
  };

  useEffect(() => {
    const handlePanelMouseMove = (e: MouseEvent) => {
      if (!draggingPanel || !containerRef.current) return;

      const deltaX = e.clientX - draggingPanel.initialMouseX;
      const deltaY = e.clientY - draggingPanel.initialMouseY;

      const newX = draggingPanel.initialPanelX + (deltaX / zoomLevel);
      const newY = draggingPanel.initialPanelY + (deltaY / zoomLevel);

      setPanels(prevPanels =>
        prevPanels.map(p =>
          p.id === draggingPanel.id ? { ...p, x: newX, y: newY } : p
        )
      );
    };

    const handlePanelMouseUp = () => {
      if (draggingPanel) {
        document.body.classList.remove('cursor-grabbing');
        setDraggingPanel(null);
      }
    };

    if (draggingPanel) {
      window.addEventListener('mousemove', handlePanelMouseMove);
      window.addEventListener('mouseup', handlePanelMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePanelMouseMove);
      window.removeEventListener('mouseup', handlePanelMouseUp);
      if (draggingPanel) {
        document.body.classList.remove('cursor-grabbing');
      }
    };
  }, [draggingPanel, zoomLevel, activeZCounter, panels]); // Added panels to dependencies for completeness

  const gridStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100000px',
    height: '100000px',
    backgroundImage:
      `linear-gradient(hsl(var(--muted)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted)) 1px, transparent 1px)`,
    backgroundSize: `${50 * zoomLevel}px ${50 * zoomLevel}px`,
    transform: `scale(${zoomLevel})`,
    transformOrigin: '0 0',
    transition: 'transform 0.2s ease-out, background-size 0.2s ease-out',
    zIndex: 1,
  };

  return (
    <>
      <div
        ref={containerRef}
        onContextMenu={handleContextMenu}
        style={{
          width: '100vw',
          height: 'calc(100vh - 5rem)', 
          overflow: 'scroll',
          background: 'hsl(var(--background))',
          position: 'relative',
        }}
        data-cursor-interactive="true"
      >
        <div ref={gridRef} style={gridStyle} />

        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100000px', 
            height: '100000px', 
            pointerEvents: 'none',
            zIndex: SVG_LINES_Z_INDEX,
            transform: `scale(${zoomLevel})`,
            transformOrigin: '0 0',
            transition: 'transform 0.2s ease-out',
          }}
        >
          {panels
            .filter((panel) => panel.type === 'analysisResult' && panel.sourcePanelId)
            .map((analysisPanel) => {
              const sourcePanel = panels.find((p) => p.id === analysisPanel.sourcePanelId);
              if (!sourcePanel) return null;

              // Reverted SVG line calculations
              const x1 = sourcePanel.x + sourcePanel.width / 2;
              const y1 = sourcePanel.y + sourcePanel.height;
              const x2 = analysisPanel.x + analysisPanel.width / 2;
              const y2 = analysisPanel.y; 

              return (
                <line
                  key={`line-${sourcePanel.id}-${analysisPanel.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2 / zoomLevel} 
                  strokeDasharray={`${8 / zoomLevel} ${4 / zoomLevel}`}
                />
              );
            })}
        </svg>


        {panels.length === 0 && !menuVisible && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 2, pointerEvents: 'none' }}>
            <p className="text-muted-foreground text-lg">Infinite Whiteboard</p>
            <p className="text-muted-foreground/80 text-sm">Scroll to explore. Right-click for options. Ctrl/Cmd + Scroll to zoom.</p>
          </div>
        )}

        {menuVisible && (
          <div
            ref={menuRef}
            className={cn(
              "absolute w-48 rounded-md bg-popover p-1 text-popover-foreground shadow-lg border border-border"
            )}
            style={{
              top: menuPosition.y + 'px', // Already in canvas coordinates
              left: menuPosition.x + 'px', // Already in canvas coordinates
              zIndex: CONTEXT_MENU_Z_INDEX,
              // Removed scaling from context menu itself
            }}
          >
            <button
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => { addPanel('chatbot'); setMenuVisible(false); }}
              data-cursor-interactive="true"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat bot</span>
            </button>
            <button
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => { addPanel('fileCard'); setMenuVisible(false); }}
              data-cursor-interactive="true"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>Add file</span>
            </button>
          </div>
        )}

        {panels.map(panel => {
          // Reverted panel width and height style application
          const panelBaseStyle: CSSProperties = {
            position: 'absolute',
            top: `${panel.y}px`,
            left: `${panel.x}px`,
            width: `${panel.width}px`,
            height: `${panel.height}px`,
            transform: `scale(${1 / zoomLevel})`,
            transformOrigin: 'top left',
            zIndex: panel.zIndex,
            display: 'flex',
            flexDirection: 'column',
          };

          if (panel.type === 'chatbot') {
            return (
              <div
                key={panel.id}
                className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border"
                style={panelBaseStyle}
                data-cursor-interactive="true"
              >
                <div
                  className="flex justify-between items-center p-3 border-b bg-muted/40 flex-shrink-0 cursor-grab"
                  onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-md font-semibold text-card-foreground">AI Chat Assistant</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); removePanel(panel.id); }}
                    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                    aria-label="Close chatbot"
                    data-cursor-interactive="true"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-grow min-h-0"> 
                  <ChatInterface initialMessages={panel.initialChatMessages} />
                </div>
              </div>
            );
          }
          if (panel.type === 'fileCard') {
            return (
              <div
                key={panel.id}
                className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border"
                style={panelBaseStyle}
                data-cursor-interactive="true"
              >
                <div
                  className="flex justify-between items-center p-3 border-b bg-muted/40 flex-shrink-0 cursor-grab"
                  onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-md font-semibold text-card-foreground">Upload Files</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); removePanel(panel.id); }}
                    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                    aria-label="Close file uploader"
                    data-cursor-interactive="true"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                 <FileCardPanelContent
                  key={`${panel.id}-content`} // Ensure unique key for content too
                  panelId={panel.id}
                  panelX={panel.x}
                  panelY={panel.y}
                  panelWidth={panel.width}
                  panelHeight={panel.height}
                  onClose={() => removePanel(panel.id)}
                  onInitiateChat={handleInitiateChatWithFiles}
                  onGetInsights={handleRequestAnalysis}
                />
              </div>
            );
          }
          if (panel.type === 'analysisResult') {
            return (
              <div
                key={panel.id}
                className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border"
                style={panelBaseStyle}
                data-cursor-interactive="true"
              >
                <div
                  className="flex justify-between items-center p-3 border-b bg-muted/40 flex-shrink-0 cursor-grab"
                  onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-md font-semibold text-card-foreground">
                    Analysis Output
                  </h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); removePanel(panel.id); }}
                    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                    aria-label={`Close analysis output`}
                    data-cursor-interactive="true"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-grow min-h-0">
                  <AnalysisResultPanelContent content={panel.content!} />
                </div>
              </div>
            );
          }
          return null;
        })}

      </div>
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2" style={{ zIndex: ZOOM_CONTROLS_Z_INDEX }}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          aria-label="Zoom In"
          data-cursor-interactive="true"
          className="bg-card hover:bg-accent"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          aria-label="Zoom Out"
          data-cursor-interactive="true"
          className="bg-card hover:bg-accent"
        >
          <Minus className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
    
