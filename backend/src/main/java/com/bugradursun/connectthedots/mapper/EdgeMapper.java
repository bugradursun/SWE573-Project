package com.bugradursun.connectthedots.mapper;

import com.bugradursun.connectthedots.dto.EdgeDto;
import com.bugradursun.connectthedots.entity.Edge;
import org.springframework.stereotype.Component;

@Component
public class EdgeMapper {

    public static EdgeDto toDto(Edge edge) {
        EdgeDto dto = new  EdgeDto(
                edge.getId(),
                edge.getSource().getId(),it 
                edge.getTarget().getId(),
                edge.getBoard().getId(),
                edge.getTitle(),
                edge.getCreatedBy()
        );
        return dto;
    }
}
