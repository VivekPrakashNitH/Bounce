
import React, { useState } from 'react';
import { Copy, Code, Check } from 'lucide-react';

export const JavaSpringBootGenerator: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
  };

  const entityCode = `package com.bounce.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String text;
    private LocalDateTime timestamp = LocalDateTime.now();
}`;

  const repoCode = `package com.bounce.backend.repository;

import com.bounce.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Custom queries can go here
}`;

  const controllerCode = `package com.bounce.backend.controller;

import com.bounce.backend.model.Comment;
import com.bounce.backend.repository.CommentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*") // Allow frontend access
public class CommentController {

    private final CommentRepository repository;

    public CommentController(CommentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Comment> getAllComments() {
        return repository.findAll();
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return repository.save(comment);
    }
}`;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-8">
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center text-green-500">
                <Code size={20} />
            </div>
            <div>
                <h3 className="text-white font-bold">Real Backend Blueprints</h3>
                <p className="text-zinc-500 text-xs">Copy this code to build the actual API in IntelliJ/Eclipse.</p>
            </div>
        </div>

        <div className="p-4 space-y-6">
            
            {/* Entity */}
            <div className="group relative">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono pl-2">src/main/java/.../model/Comment.java</div>
                <div className="bg-black rounded-lg p-4 font-mono text-xs text-green-300 overflow-x-auto relative">
                    <pre>{entityCode}</pre>
                    <button 
                        onClick={() => copyToClipboard(entityCode, 'entity')}
                        className="absolute top-2 right-2 p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                        {copied === 'entity' ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            {/* Repository */}
            <div className="group relative">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono pl-2">src/main/java/.../repository/CommentRepository.java</div>
                <div className="bg-black rounded-lg p-4 font-mono text-xs text-blue-300 overflow-x-auto relative">
                    <pre>{repoCode}</pre>
                    <button 
                        onClick={() => copyToClipboard(repoCode, 'repo')}
                        className="absolute top-2 right-2 p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                        {copied === 'repo' ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            {/* Controller */}
            <div className="group relative">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono pl-2">src/main/java/.../controller/CommentController.java</div>
                <div className="bg-black rounded-lg p-4 font-mono text-xs text-orange-300 overflow-x-auto relative">
                    <pre>{controllerCode}</pre>
                    <button 
                        onClick={() => copyToClipboard(controllerCode, 'ctrl')}
                        className="absolute top-2 right-2 p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                        {copied === 'ctrl' ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};
